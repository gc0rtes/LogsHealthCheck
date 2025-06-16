# Development Instructions for Stream CS Integration Health Check Tool

## Development Approach

### AI-Assisted Development Best Practices

1. **Enable Auto-Run Commands Mode**
   - When working with AI, enable auto-run commands mode for faster development
   - This allows the AI to execute commands directly, speeding up the development process
   - Example prompt: "Enable auto-run commands mode and help me implement [feature]"

2. **Test-Driven Development (TDD)**
   - Always start with writing tests before implementing features
   - Let the AI help you write tests first
   - Then implement the code to make tests pass
   - Example workflow:
     ```javascript
     // 1. Write test first
     describe('parseCSVData', () => {
       it('should correctly parse CSV data with required fields', () => {
         const mockData = 'response,error_code,operation_type,error_message,x-stream-client,product,@timestamp\n';
         const result = parseCSVData(mockData);
         expect(result).toBeDefined();
         // Add more specific assertions
       });
     });

     // 2. Implement the function
     // 3. Run tests until they pass
     ```

3. **Iterative Development**
   - Work in small, testable increments
   - Let the AI help you refine the code until all tests pass
   - Don't hesitate to ask for improvements or optimizations

### Styling and UI Development

1. **Manual Setup Required**
   - The AI may not be the best at handling styling and UI setup
   - Manually install and configure:
     - Vite
     - TailwindCSS
     - Other UI dependencies
   - This ensures proper configuration and avoids potential issues

2. **UI Component Development**
   - Use the AI for logic and functionality
   - Handle styling and layout manually
   - This gives you better control over the UI/UX

## Core Functions Implementation

### 1. CSV Data Processing

```javascript
// Example implementation of CSV data processing
const processCSVData = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const processedData = results.data.map(row => ({
          response: row.response,
          errorCode: row.error_code,
          operationType: row.operation_type,
          errorMessage: row.error_message,
          client: row['x-stream-client'],
          product: row.product,
          timestamp: new Date(row['@timestamp'])
        }));
        resolve(processedData);
      },
      error: (error) => reject(error)
    });
  });
};
```

### 2. Data Analysis Functions

```javascript
// Error distribution analysis
const analyzeErrorDistribution = (data) => {
  return data.reduce((acc, curr) => {
    const errorCode = curr.errorCode;
    acc[errorCode] = (acc[errorCode] || 0) + 1;
    return acc;
  }, {});
};

// Time series analysis
const analyzeTimeSeries = (data) => {
  return data.reduce((acc, curr) => {
    const date = curr.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
};

// Client error breakdown
const analyzeClientErrors = (data) => {
  return data.reduce((acc, curr) => {
    const client = curr.client;
    if (!acc[client]) {
      acc[client] = {
        total: 0,
        errors: {}
      };
    }
    acc[client].total++;
    acc[client].errors[curr.errorCode] = (acc[client].errors[curr.errorCode] || 0) + 1;
    return acc;
  }, {});
};
```

### 3. Data Export Functions

```javascript
// Export analysis results
const exportAnalysisResults = (data) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'error-analysis.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};
```

## Testing Strategy

1. **Unit Tests**
   - Test each data processing function independently
   - Mock CSV data for testing
   - Verify correct data transformation

2. **Integration Tests**
   - Test the flow from file upload to visualization
   - Verify data consistency across components

3. **Example Test Suite**

```javascript
describe('Data Processing', () => {
  describe('processCSVData', () => {
    it('should process valid CSV data', async () => {
      const mockFile = new File(['header\nrow1'], 'test.csv');
      const result = await processCSVData(mockFile);
      expect(result).toBeDefined();
    });
  });

  describe('analyzeErrorDistribution', () => {
    it('should correctly count error occurrences', () => {
      const mockData = [
        { errorCode: '400' },
        { errorCode: '400' },
        { errorCode: '404' }
      ];
      const result = analyzeErrorDistribution(mockData);
      expect(result['400']).toBe(2);
      expect(result['404']).toBe(1);
    });
  });
});
```

## Development Workflow

1. **Setup Phase**
   - Manually set up project with Vite and TailwindCSS
   - Install required dependencies
   - Configure development environment

2. **Implementation Phase**
   - Write tests for each feature
   - Implement core functionality
   - Use AI for logic and data processing
   - Handle UI/UX manually

3. **Testing Phase**
   - Run unit tests
   - Perform integration testing
   - Verify data processing accuracy
   - Test visualization components

4. **Refinement Phase**
   - Optimize performance
   - Improve error handling
   - Enhance user experience
   - Add additional features as needed

## Best Practices

1. **Code Organization**
   - Keep data processing functions pure and testable
   - Separate concerns (data processing, visualization, UI)
   - Use TypeScript for better type safety

2. **Error Handling**
   - Implement proper error boundaries
   - Validate input data
   - Provide meaningful error messages

3. **Performance**
   - Process large datasets efficiently
   - Implement proper memoization
   - Use web workers for heavy computations

4. **Documentation**
   - Document complex functions
   - Add JSDoc comments
   - Keep README updated

Remember: While AI can help with logic and functionality, certain aspects like styling, UI setup, and project configuration are better handled manually for optimal results.

## AI-Assisted Project Generation

### Example Prompts for Project Setup

1. **Initial Project Setup**
```
Enable auto-run commands mode and help me create a React application for analyzing 4xx error logs from CSV files. The app should:
- Use Vite as the build tool
- Include TailwindCSS for styling
- Have a drag-and-drop interface for CSV files
- Process CSV files with the following required fields: response, error_code, operation_type, error_message, x-stream-client, product, @timestamp
- Generate visualizations for error distribution, time series, and client breakdown
```

2. **Data Processing Implementation**
```
Enable auto-run commands mode and help me implement the CSV data processing functionality:
- Create a function to parse CSV files using PapaParse
- Implement data validation for required fields
- Add error handling for malformed data
- Create data transformation functions for visualization
```

3. **Visualization Components**
```
Enable auto-run commands mode and help me implement the visualization components:
- Create a component for error distribution chart using Recharts
- Implement a time series visualization
- Add a client error breakdown component
- Include interactive filtering and sorting capabilities
```

4. **Testing Setup**
```
Enable auto-run commands mode and help me set up the testing environment:
- Configure Jest for unit testing
- Create test suites for data processing functions
- Implement integration tests for the file upload flow
- Add test cases for visualization components
```

5. **Error Handling and Edge Cases**
```
Enable auto-run commands mode and help me implement robust error handling:
- Add validation for CSV file format
- Implement error boundaries for React components
- Create user-friendly error messages
- Handle edge cases in data processing
```

### Tips for Effective AI Collaboration

1. **Be Specific**
   - Clearly define requirements
   - Specify expected behavior
   - Include example data structures

2. **Iterative Development**
   - Start with basic functionality
   - Add features incrementally
   - Test each component thoroughly

3. **Code Review**
   - Review AI-generated code
   - Ensure it follows best practices
   - Make necessary adjustments

4. **Documentation**
   - Ask for documentation
   - Request comments for complex logic
   - Get explanations for implementation choices 