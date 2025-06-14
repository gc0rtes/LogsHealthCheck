import Papa from "papaparse";
import {
  countClientType,
  resetClientTypeCounters,
  printFinalSDKCounts,
} from "./clientUtils";

// Helper function to parse app_id number format
const parseAppId = (appId) => {
  if (!appId) return null;
  // Remove commas and convert to number
  return parseInt(appId.replace(/,/g, ""), 10);
};

const REQUIRED_FIELDS = [
  "response",
  "error_code",
  "operation_type",
  "error_message",
  "x-stream-client",
  "product",
  "@timestamp",
];

export const validateCSV = (data) => {
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => !data[0] || !(field in data[0])
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Filter for chat product only
  const chatData = data.filter((entry) => entry.product === "chat");
  if (chatData.length === 0) {
    throw new Error("No chat product entries found in the CSV file");
  }

  return chatData;
};

export const getTimeWindow = (data) => {
  const timestamps = data.map((entry) => new Date(entry["@timestamp"]));
  const startTime = new Date(Math.min(...timestamps));
  const endTime = new Date(Math.max(...timestamps));
  return { startTime, endTime };
};

// Process CSV data from string
export const processCSV = (csvData) => {
  resetClientTypeCounters(); // Reset counters before processing a new file
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  if (results.errors.length > 0) {
    throw new Error("Error parsing CSV file");
  }

  const validatedData = validateCSV(results.data);

  // Call countClientType only once per row for accurate SDK counts
  validatedData.forEach((row, idx) => {
    countClientType(row["x-stream-client"], idx);
  });

  // Print final counts after processing
  printFinalSDKCounts();

  const timeWindow = getTimeWindow(validatedData);

  return {
    data: validatedData,
    timeWindow,
  };
};

// Group errors by status code and operation type
export const groupErrors = (data) => {
  // First level grouping by response code
  const responseGroups = new Map();

  data.forEach((entry) => {
    const response = parseInt(entry.response, 10);

    // Skip responses outside 400-499 range
    if (response < 400 || response > 499) {
      return;
    }

    const errorCode = entry.error_code;
    const operationType = entry.operation_type;
    const errorMessage = entry.error_message;
    const client = entry["x-stream-client"];
    const appId = parseAppId(entry.app_id);

    // Initialize response group if it doesn't exist
    if (!responseGroups.has(response)) {
      responseGroups.set(response, {
        response,
        count: 0,
        error_codes: new Map(),
        clients: new Set(),
        app_ids: new Set(),
      });
    }

    const responseGroup = responseGroups.get(response);
    responseGroup.count++;
    responseGroup.clients.add(client);
    if (appId) responseGroup.app_ids.add(appId);

    // Initialize error code subgroup if it doesn't exist
    if (!responseGroup.error_codes.has(errorCode)) {
      responseGroup.error_codes.set(errorCode, {
        error_code: errorCode,
        count: 0,
        operations: new Map(),
        clients: new Set(),
        app_ids: new Set(),
      });
    }

    const errorCodeGroup = responseGroup.error_codes.get(errorCode);
    errorCodeGroup.count++;
    errorCodeGroup.clients.add(client);
    if (appId) errorCodeGroup.app_ids.add(appId);

    // Add operation type and its error message if not exists
    if (!errorCodeGroup.operations.has(operationType)) {
      errorCodeGroup.operations.set(operationType, {
        operation_type: operationType,
        error_message: errorMessage,
      });
    }
  });

  // Convert Map structures to arrays for JSON serialization
  return Array.from(responseGroups.values()).map((responseGroup) => ({
    response: responseGroup.response,
    count: responseGroup.count,
    clients: Array.from(responseGroup.clients),
    app_ids: Array.from(responseGroup.app_ids).sort((a, b) => a - b),
    error_codes: Array.from(responseGroup.error_codes.values()).map(
      (errorCodeGroup) => ({
        error_code: errorCodeGroup.error_code,
        count: errorCodeGroup.count,
        clients: Array.from(errorCodeGroup.clients),
        app_ids: Array.from(errorCodeGroup.app_ids).sort((a, b) => a - b),
        operations: Array.from(errorCodeGroup.operations.values()),
      })
    ),
  }));
};

// Format the results into JSON
export const formatResults = (groupedData, timeWindow) => {
  // Sort by response code
  const sortedGroups = [...groupedData].sort((a, b) => a.response - b.response);

  // Calculate total errors
  const totalErrors = sortedGroups.reduce((sum, group) => sum + group.count, 0);

  // Get unique app IDs
  const appIds = [...new Set(sortedGroups.flatMap((group) => group.app_ids))];

  return {
    total_errors: totalErrors,
    time_window: {
      start: timeWindow.startTime.toISOString(),
      end: timeWindow.endTime.toISOString(),
    },
    app_ids: appIds,
    error_groups: sortedGroups.map((group) => ({
      response: group.response,
      count: group.count,
      clients: group.clients,
      app_ids: group.app_ids,
      error_codes: group.error_codes.map((errorCode) => ({
        error_code: errorCode.error_code,
        count: errorCode.count,
        clients: errorCode.clients,
        app_ids: errorCode.app_ids,
        operations: errorCode.operations,
      })),
    })),
  };
};

// Main function to process CSV data
export const analyzeErrors = async (file) => {
  try {
    const text = await file.text();
    const { data, timeWindow } = processCSV(text);
    const groupedData = groupErrors(data);
    return formatResults(groupedData, timeWindow);
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};
