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
    const responseCode = parseInt(row.response);
    // Only process 4xx errors
    if (responseCode < 400 || responseCode >= 500) return;

    const errorCode = row.error_code;
    const operationType = row.operation_type;
    const errorMessage = parseErrorMessage(row.error_message);

    const key = `${responseCode}-${errorCode}`;

    if (!groups[key]) {
      groups[key] = {
        responseCode: responseCode.toString(),
        errorCode,
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
      };
    }
    groups[key].operationTypes[operationType].count++;
  });

  // Convert to array and sort by count
  return Object.values(groups)
    .map((group) => ({
      ...group,
      operationTypes: Object.values(group.operationTypes).sort(
        (a, b) => b.count - a.count
      ),
    }))
    .sort((a, b) => b.count - a.count);
};

export { extractErrorGroups };
