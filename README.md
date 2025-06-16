# Stream CS Integration Health Check Tool

This is an internal project developed by the Stream CS team to enhance the Integration Health Check process for our customers. The tool helps analyze and visualize 4xx error responses from customer integrations, providing valuable insights for troubleshooting and optimization.

## Features

- CSV file analysis for 4xx error responses
- Interactive data visualization with multiple chart types:
  - Error Distribution Chart: Visualizes the distribution of different error codes
  - Time Series Analysis: Shows error patterns over time
  - Client Error Breakdown: Displays error distribution by client
  - Operation Type Analysis: Breaks down errors by operation type
  - Top Error Messages: Highlights most frequent error messages


## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Application

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Usage

1. Prepare your CSV file with the following required fields:
   - response
   - error_code
   - operation_type
   - error_message
   - x-stream-client
   - product
   - @timestamp

2. You can use the sample CSV file located in the `assets` folder as a reference.

3. To generate a new CSV file from Kibana:
   - Go to: http://kibana.us-east.gtstrm.com/goto/f7a84a00-49f2-11f0-8c56-1b4588df5dbc
   - Filter your logs for failed requests (4xx series)
   - Export the filtered data as CSV
   - Ensure all required fields are included in the export

4. Upload your CSV file through the application's interface

5. View the analysis and visualizations of the error data

## Development

- Run tests: `npm test`
- Run linter: `npm run lint`

## Technologies Used

- React
- Vite
- TailwindCSS
- PapaParse (CSV parsing)
- Recharts (Data visualization)
- React Dropzone (File upload)

## Contributing

This is an internal tool. Please follow the team's coding standards and submit pull requests for any improvements.

## License

Internal use only - Stream
