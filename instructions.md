Refined Prompt for AI: Interactive Error Log Analysis Dashboard (React, Vite, TailwindCSS)
I need you to act as an expert React developer and create a comprehensive single-page web application for analyzing error logs. This interactive dashboard will enable users to upload CSV files containing HTTP response codes for both 2xx (success) and 4xx (client error) series data, visualizing key metrics and distributions.

1. Project Setup and Core Technologies:
Project Initialization: Create a new React project using Vite.
Styling: Implement all styling exclusively using TailwindCSS.
Essential Dependencies: Install the following npm packages:
recharts: For all charting components.
react-dropzone: For the file upload mechanism.
papaparse: For efficient CSV parsing.
@heroicons/react: For all UI icons.
2. CSV File Structure (Mandatory Columns & Filtering):
The application must strictly adhere to the following CSV column schema. Refer to the sample.csv file in the root folder of the project for the exact file format to be ingested. If any of these columns are missing from an uploaded CSV, the application must display an error message and reject the file.

@timestamp: ISO 8601 format (e.g., 2023-10-27T10:30:00Z). This column is crucial for time window analysis and data ordering.
error_code: This represents a Stream-specific numeric error code. Its reference for mapping descriptions can be found in the src/utils/errorCodes.js file.
error_message: This is the Stream-specific detailed textual description of the error from the log entry itself.
operation_type: The type of operation that occurred (e.g., DeleteChannel, SendMessage, data_sync, etc.).
product: The identifier for the product associated with the log entry. Crucially, the dashboard should only analyze data where the product column explicitly contains the value "Chat". All other product entries should be filtered out before analysis.
response: The HTTP response code (e.g., 200, 404, 500). The primary focus of this dashboard is on response codes within the 4xx series (client errors). While 2xx codes might be present in the raw data, calculations for "Total Errors" and charts should specifically target 4xx responses.
x-stream-client: The client identifier string (e.g., stream-java-client-1.29.0, stream-video-react_native-v1.11.5|client_bundle=browser-esm).
3. Core Application Features & User Experience:
File Upload Interface:
A prominent drag-and-drop zone for CSV file upload.
Only single CSV file uploads are supported at a time.
Robust Error Handling: If the uploaded CSV is missing any of the required columns (as defined in Section 2), display a clear, user-friendly error message (e.g., "Invalid CSV file: Missing required columns. Please ensure your CSV contains @timestamp, error_code, error_message, operation_type, product, response, and x-stream-client.").
After a file is successfully processed and the dashboard is displayed, an "Upload New File" button should be visible. Clicking this button should clear the current analysis and prepare the interface for a new CSV upload.
Dashboard Layout & Components:
Time Window Information: Display the start and end timestamps (in GTM) of the analyzed error logs. This information must be extracted from the @timestamp column of the loaded and filtered CSV data.

Summary Cards:

Total Errors: A card displaying the total count of errors. An error is strictly defined as any entry where the response column has a value greater than or equal to 400 and less than or equal to 499.

Total Unique Error Codes: A card displaying the total number of distinct error_code values found among the filtered 4xx error logs.
Charts (using Recharts):

Error Distribution by Response Code (Pie Chart):
Visualize the percentage distribution of error response codes specifically within the 4xx series (i.e., response values between 400 and 499 inclusive).
Each slice of the pie chart should represent a unique error response code in this range, clearly showing its percentage of the total 4xx errors.

Error Distribution by Operation Type (Stacked Bar Chart):
Show the total number of errors (4xx series), broken down by operation_type.
Each bar should represent a distinct operation_type. Segments within each bar should represent the different 4xx error response codes associated with that specific operation_type.

Error Distribution by Client Type (Pie Chart):
Client Classification Logic: Implement the provided pure JavaScript function, classifyClientType(clientString), to categorize the x-stream-client string into predefined client types. This function should reside in a src/utils helper file.

JavaScript

// Pure function: just returns the type
export const classifyClientType = (clientString) => {
  if (!clientString) return "Unknown";

  const client = clientString.toLowerCase();
  if (client.includes("web") || client.includes("react")) return "Web (React)";
  if (client.includes("ios")) return "iOS";
  if (client.includes("android")) return "Android";
  if (client.includes("react-native")) return "React Native";
  if (client.includes("python")) return "Python SDK";
  if (client.includes("node")) return "Node.js SDK";
  if (client.includes("java")) return "Java SDK";
  if (client.includes("php")) return "PHP SDK";
  if (client.includes("ruby")) return "Ruby SDK";
  if (client.includes("go")) return "Go SDK";
  if (client.includes("dotnet")) return ".NET SDK";
  return "Other";
};
After classification, the pie chart should display the percentage of errors (specifically 4xx series errors) for each detected client type.

Latest Client Versions Card:
Create a dedicated card that displays the most recent version detected for each classified client type.
Version Extraction: You must implement robust logic to extract version numbers from the x-stream-client string. Assume versions will typically follow a MAJOR.MINOR.PATCH format (e.g., 1.2.3). Handle cases where versions might not be present or are in a slightly different common format.
Version Comparison: Use the provided compareVersions helper function for semantic version comparison. This function should also reside in a src/utils helper file.
JavaScript

// Helper function to compare versions
export const compareVersions = (v1, v2) => {
  const v1Parts = v1.split(".").map(Number);
  const v2Parts = v2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1Parts[i] > v2Parts[i]) return 1;
    if (v1Parts[i] < v2Parts[i]) return -1;
  }
  return 0;
};
Get Latest Versions Function: Adapt and utilize the provided getLatestVersions function. Ensure getClientVersion (which extracts the version from the x-stream-client string) is implemented correctly.
JavaScript

// Get latest version for each client type (Adapt `parsedErrorLogs` to your actual filtered data structure)
export const getLatestVersions = (parsedErrorLogs) => {
  const versions = {};
  parsedErrorLogs.forEach((logEntry) => {
    const clientType = classifyClientType(logEntry['x-stream-client']);
    // Assuming getClientVersion extracts the version string from x-stream-client
    const version = getClientVersion(logEntry['x-stream-client']); // Implement this helper
    if (version) {
      if (
        !versions[clientType] ||
        compareVersions(version, versions[clientType]) > 0
      ) {
        versions[clientType] = version;
      }
    }
  });
  return versions;
};
Detailed Error Groups Table with Expandable Rows:

This table will provide a granular, interactive view of the 4xx errors.
Fixed Columns:
API Response Code: Example: 400 - Bad Request. This should combine the HTTP response code with its common textual description (from errorCodes.js).
Stream Error Code: Example: 4 - Input Error. This column should be clickable/expandable.
Count: The total number of occurrences for the specific Stream Error Code under the given API Response Code from the filtered data.
Description: The detailed explanation of the Stream Error Code (from errorCodes.js).
Expandable Functionality: When a Stream Error Code is clicked, an expandable row should appear directly below it. This expanded row should reveal a list of associated operation_type values and an example error_message from the CSV file for each unique operation_type.
Example Output for Expanded Row:
Operation Type  | Error Message (Example)
----------------|----------------------------------------------------
SendMessage     | Description of the specific error_message from CSV
DeleteChannel   | Another specific error_message from CSV
If there are multiple error_message values for the same operation_type within that Stream Error Code group, display just one representative error_message example.
Error Code Mapping: The Stream Error Code and Description must be retrieved from the dedicated utility file (src/utils/errorCodes.js).
4. Visual Design and Aesthetics:
Responsiveness: The entire application must be fully responsive, ensuring optimal user experience across various screen sizes (mobile, tablet, desktop).
Iconography: Use Heroicons for all UI elements that require icons.
Color Scheme:
Main button color: #2c2121
Chart colors: #0088FE, #00C49F, #FFBB28, #FF8042, #8884D8 (ensure these are used consistently and effectively for chart segments/bars).
5. Error Code Handling (Internal Mapping):
Create a JavaScript file at src/utils/errorCodes.js. This file must export a data structure (e.g., an array of objects or a Map) defining the mapping between common 4xx HTTP response codes, their associated "Stream Error Codes" (a custom classification), and detailed descriptions.
This mapping will be crucial for populating the "Detailed Error Groups Table". Include at least the following mappings:
4xx Series (Client Errors):
HTTP Code: 400, Stream Error Code: 4, Description: Input Error
HTTP Code: 401, Stream Error Code: 5, Description: Authentication Error
HTTP Code: 403, Stream Error Code: 17, Description: Not Allowed Error
HTTP Code: 404, Stream Error Code: 16, Description: Does Not Exist Error
HTTP Code: 429, Stream Error Code: 9, Description: Rate Limit Error
6. Modular Application Structure (Crucial for Organization):
Adhere strictly to the following modular structure for enhanced maintainability, readability, and separation of concerns:

App.jsx: This will be the main application component. It should handle the file upload logic (react-dropzone), trigger the initial data parsing and filtering, manage the application state (e.g., isLoading, parsedData, error), and conditionally render the Dashboard component once valid data is available.
Dashboard.jsx: This component will encapsulate all the dashboard visualizations (summary cards, charts, and tables). It will receive the pre-processed and filtered error data as props from App.jsx.
src/utils/errorCodes.js: Contains the error code definitions and descriptions as specified in Section 5.
src/utils/errorLogs.js: This file should be responsible for:
The core CSV parsing logic using papaparse.
Data validation logic, specifically checking for the presence of all required columns.
Data Filtering Logic: Implement the filtering for product: "Chat" and response codes in the 4xx series.
Initial data aggregation and preprocessing functions that prepare the raw CSV data into a format suitable for consumption by the various dashboard components.
src/utils/charts/: Create a sub-folder named charts under src/utils. For each chart, create a dedicated file within this folder (e.g., src/utils/charts/pieChartDataProcessor.js, src/utils/charts/stackedBarChartDataProcessor.js). Each file should contain a pure function specifically designed to transform the raw error log data into the exact data structure required by its corresponding Recharts component.
7. Key Features to Implement (Recap and Emphasis):
Real-time Data Processing (Immediate Update): While not truly "real-time" in a continuous streaming sense, the dashboard must re-render and update immediately and seamlessly upon successful CSV file upload and processing.
Interactive Charts: Ensure all charts have informative tooltips that appear on hover to display detailed data points.
Expandable Error Details: Fully implement the expandable rows functionality in the "Detailed Error Groups Table" as described, showing operation_type and example error_message values.
Responsive Layout: The design must adapt gracefully to different screen sizes and orientations.
Comprehensive Error Handling: Beyond just file validation, implement robust error handling for potential issues during data parsing (e.g., malformed date formats, unexpected data types, papaparse errors).
Version Tracking & Client Type Detection: Precisely implement the logic for the "Latest Client Versions Card" and "Error Distribution by Client Type" chart, ensuring accurate extraction, comparison, and display of client versions.
8. Testing Considerations:
Provide clear instructions on how to set up and test the application effectively.

CSV Variety: Ensure the application functions correctly with a diverse set of CSV files:
Files containing all required columns and valid data, including product: "Chat" and both 2xx and 4xx response codes.
Files missing one or more required columns (verify that the error handling logic is triggered correctly).
Files with additional, unused columns (these should be gracefully ignored during processing).
CSV files with a large number of rows (e.g., 10,000+ entries) to assess performance under load.
Files containing entries where product is not "Chat" (verify these are correctly filtered out).
Error Handling Verification: Explicitly test all error messages and scenarios, including invalid file types (e.g., uploading a .txt instead of .csv), corrupted CSV structures, and files with malformed data within valid columns.
Responsive Design Check: Thoroughly verify the layout, chart rendering, and overall functionality across various browser window sizes and simulated device views (e.g., using browser developer tools).
9. Performance Considerations (Guidance for AI's Implementation):
Optimize Large CSV Processing: Prioritize efficient techniques for handling large CSV files, such as streaming parsing (which papaparse supports) and avoiding unnecessary in-memory data duplication.
Efficient Data Grouping and Aggregation: Suggest using optimized data structures (e.g., Map objects for grouping) and algorithms for aggregating data for charts and tables to prevent performance bottlenecks, especially with many data points.
Memoization: Strongly recommend utilizing React's built-in memoization features (React.memo for components, useMemo for expensive calculations, and useCallback for stable function references) to prevent unnecessary re-renders of components and recalculations of data.
Chart Rendering Optimization: Advise on best practices for Recharts performance, such as avoiding excessive re-renders of charts, and if dealing with extremely dense data, considering techniques like data sampling or aggregation at lower zoom levels (though this might be overkill for initial implementation unless specifically requested).