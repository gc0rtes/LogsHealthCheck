import Papa from "papaparse";
import { classifyClientType } from "./clientClassification";
import { extractLatestSDKVersions } from "./sdkVersionExtractor";

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
        const clientTypeDistribution = {};
        const sdkErrorDistribution = {};
        let total4xxErrors = 0;

        // Extract SDK versions from all client strings
        const clientStrings = data
          .map((row) => row["x-stream-client"])
          .filter(Boolean);
        const sdkVersions = extractLatestSDKVersions(clientStrings);

        data.forEach((row) => {
          const response = parseInt(row.response);
          if (response >= 400 && response < 500) {
            total4xxErrors++;
            errorDistribution[response] =
              (errorDistribution[response] || 0) + 1;

            // Count client type distribution
            const clientType = classifyClientType(row["x-stream-client"]);
            clientTypeDistribution[clientType] =
              (clientTypeDistribution[clientType] || 0) + 1;

            // Count SDK error distribution using classified client type
            const sdkType = classifyClientType(row["x-stream-client"]);
            const errorCode = row.error_code || "Unknown";

            if (!sdkErrorDistribution[sdkType]) {
              sdkErrorDistribution[sdkType] = {};
            }
            sdkErrorDistribution[sdkType][errorCode] =
              (sdkErrorDistribution[sdkType][errorCode] || 0) + 1;
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

        // Convert client type distribution to percentages and format for chart
        const clientTypeDistributionData = Object.entries(
          clientTypeDistribution
        ).map(([type, count]) => ({
          name: type,
          value: count,
          percentage: ((count / total4xxErrors) * 100).toFixed(1),
        }));

        // Format SDK error distribution data for the chart
        const sdkErrorDistributionData = Object.entries(
          sdkErrorDistribution
        ).map(([sdkType, errorCodes]) => ({
          sdkType,
          ...errorCodes,
        }));

        // Count unique error codes only from 4xx responses
        const uniqueErrorCodes = new Set(
          data
            .filter(
              (row) =>
                parseInt(row.response) >= 400 && parseInt(row.response) < 500
            )
            .map((row) => row.error_code)
        ).size;

        resolve({
          timeWindow,
          totalErrors: total4xxErrors,
          uniqueErrorCodes,
          errorDistribution: errorDistributionData,
          clientTypeDistribution: clientTypeDistributionData,
          sdkErrorDistribution: sdkErrorDistributionData,
          sdkVersions,
          data,
        });
      },
      error: (error) => {
        reject(new Error("Error analyzing CSV data: " + error.message));
      },
    });
  });
};
