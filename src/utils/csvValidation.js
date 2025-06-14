import Papa from "papaparse";

const REQUIRED_FIELDS = [
  "response",
  "error_code",
  "operation_type",
  "error_message",
  "x-stream-client",
  "product",
  "@timestamp",
];

export const validateCSVFields = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      preview: 1,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const missingFields = REQUIRED_FIELDS.filter(
          (field) => !headers.includes(field)
        );

        if (missingFields.length > 0) {
          reject(
            new Error(`Missing required fields: ${missingFields.join(", ")}`)
          );
        } else {
          resolve(true);
        }
      },
      error: (error) => {
        reject(new Error("Error parsing CSV file: " + error.message));
      },
    });
  });
};

export const analyzeCSVData = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data;

        // Get time window (first and last timestamp)
        const timestamps = data
          .map((row) => new Date(row["@timestamp"]))
          .filter((date) => !isNaN(date.getTime()))
          .sort((a, b) => a - b);

        const timeWindow =
          timestamps.length > 0
            ? {
                start: timestamps[0],
                end: timestamps[timestamps.length - 1],
              }
            : null;

        // Count 4xx errors
        const totalErrors = data.filter((row) => {
          const response = parseInt(row.response);
          return response >= 400 && response < 500;
        }).length;

        // Count unique error codes
        const uniqueErrorCodes = new Set(data.map((row) => row.error_code))
          .size;

        resolve({
          timeWindow,
          totalErrors,
          uniqueErrorCodes,
        });
      },
      error: (error) => {
        reject(new Error("Error analyzing CSV data: " + error.message));
      },
    });
  });
};
