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
//check if the csv file has all the required fields
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
//analyze the csv data
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

        // Count 4xx errors and their distribution
        const errorDistribution = {};
        let total4xxErrors = 0;

        data.forEach((row) => {
          const response = parseInt(row.response);
          if (response >= 400 && response < 500) {
            total4xxErrors++;
            errorDistribution[response] =
              (errorDistribution[response] || 0) + 1;
          }
        });

        // Convert distribution to percentages and format for chart
        const errorDistributionData = Object.entries(errorDistribution).map(
          ([code, count]) => ({
            name: `${code} Error`,
            value: count,
            percentage: ((count / total4xxErrors) * 100).toFixed(1),
          })
        );

        // Count unique error codes
        const uniqueErrorCodes = new Set(data.map((row) => row.error_code))
          .size;

        resolve({
          timeWindow,
          totalErrors: total4xxErrors,
          uniqueErrorCodes,
          errorDistribution: errorDistributionData,
        });
      },
      error: (error) => {
        reject(new Error("Error analyzing CSV data: " + error.message));
      },
    });
  });
};
