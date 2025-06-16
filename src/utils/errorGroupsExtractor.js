import { ERROR_CODES } from "./StreamErrorCodes";

const parseErrorMessage = (errorMessage) => {
  try {
    const parsed = JSON.parse(errorMessage);
    return parsed.message || "No message available";
  } catch {
    return errorMessage;
  }
};

const extractErrorGroups = (data) => {
  // Group by response code and error code
  const groups = {};

  data.forEach((row) => {
    // Validate required fields
    if (!row.response || !row.error_code || !row.operation_type) {
      console.warn("Skipping row with missing required fields:", row);
      return;
    }

    const responseCode = parseInt(row.response);
    // Only process 4xx errors
    if (responseCode < 400 || responseCode >= 500) return;

    // Debug log for error code parsing
    console.log(
      "Row error_code:",
      row.error_code,
      "Type:",
      typeof row.error_code
    );

    // Handle potential NaN cases
    const errorCode = parseInt(row.error_code);
    if (isNaN(errorCode)) {
      console.warn("Invalid error code found:", row.error_code);
      return; // Skip this row if error code is invalid
    }

    const operationType = row.operation_type;
    const errorMessage = parseErrorMessage(row.error_message);
    const client = row["x-stream-client"] || "-";

    const key = `${responseCode}-${errorCode}`;

    if (!groups[key]) {
      groups[key] = {
        responseCode: responseCode.toString(),
        errorCode: errorCode.toString(),
        count: 0,
        name: ERROR_CODES[errorCode]?.name || "Unknown error code",
        description:
          ERROR_CODES[errorCode]?.description || "Unknown error code",
        operationTypes: {},
      };
    }

    groups[key].count++;

    // Track operation types
    if (!groups[key].operationTypes[operationType]) {
      groups[key].operationTypes[operationType] = {
        type: operationType,
        count: 0,
        exampleMessage: errorMessage,
        clients: new Set(), // Use Set to avoid duplicates
      };
    }
    groups[key].operationTypes[operationType].count++;
    groups[key].operationTypes[operationType].clients.add(client);
  });

  // Convert to array and sort by count
  return Object.values(groups)
    .map((group) => ({
      ...group,
      operationTypes: Object.values(group.operationTypes)
        .map((op) => ({
          ...op,
          clients: Array.from(op.clients).sort(), // Convert Set to sorted array
        }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
};

export { extractErrorGroups };
