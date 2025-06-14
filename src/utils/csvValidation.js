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
