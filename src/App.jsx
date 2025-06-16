import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { validateCSVFields, analyzeCSVData } from './utils/csvValidation'
import DashboardCard from './components/DashboardCard'
import ErrorDistributionChart from './components/ErrorDistributionChart'
import ClientTypeDistributionChart from './components/ClientTypeDistributionChart'
import SDKErrorDistributionChart from './components/SDKErrorDistributionChart'
import SDKVersionsCard from './components/SDKVersionsCard'
import DetailedErrorGroupsTable from './components/DetailedErrorGroupsTable'
import { extractErrorGroups } from './utils/errorGroupsExtractor'
import { ERROR_CODES } from './utils/StreamErrorCodes'

const getResponseCodeText = (code) => {
  const statusTexts = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot',
    421: 'Misdirected Request',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Too Early',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons'
  };
  return statusTexts[code] || 'Unknown Status';
};

function App() {
  const [validationResult, setValidationResult] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;
    if (validationResult?.status === 'success') {
      timeoutId = setTimeout(() => {
        setValidationResult(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [validationResult]);

  const onDrop = async (acceptedFiles) => {
    setError(null);
    setValidationResult(null);
    setAnalysisData(null);
    const file = acceptedFiles[0];

    if (file) {
      try {
        await validateCSVFields(file);
        const analysis = await analyzeCSVData(file);
        setValidationResult({
          fileName: file.name,
          status: 'success',
          message: 'CSV file contains all required fields'
        });
        setAnalysisData(analysis);
      } catch (err) {
        setError(err.message);
        setValidationResult(null);
        setAnalysisData(null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleNewUpload = () => {
    setValidationResult(null);
    setAnalysisData(null);
    setError(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      timeZone: 'GMT',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const calculateDuration = (start, end) => {
    const diffMs = new Date(end) - new Date(start);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffWeeks > 0) {
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''}`;
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else {
      return `${diffSecs} second${diffSecs > 1 ? 's' : ''}`;
    }
  };

  const renderUploadArea = () => (
    <div className="px-4 py-6 sm:px-0">
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <div className="space-y-1 text-center">
          <input {...getInputProps()} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a CSV file</span>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">CSV files only</p>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="mb-8">
      <div className="flex justify-center mb-8">
        <button
          onClick={handleNewUpload}
          className="!bg-purple-600 hover:!bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Upload New File
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <DashboardCard title="Time Window Analysis (GMT)">
          {analysisData?.timeWindow ? (
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-600">Start: {formatDate(analysisData.timeWindow.start)}</p>
              <p className="text-sm text-gray-600">End: {formatDate(analysisData.timeWindow.end)}</p>
              <p className="text-sm font-medium text-gray-700">
                Duration: {calculateDuration(analysisData.timeWindow.start, analysisData.timeWindow.end)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">No time data available</p>
          )}
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total 4xx Errors" valueColor="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {analysisData?.totalErrors || 0}
          </div>
          {analysisData?.data && (
            <div className="text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto pr-2">
              {Array.from(new Set(analysisData.data
                .filter(row => {
                  const responseCode = parseInt(row.response);
                  return responseCode >= 400 && responseCode < 500;
                })
                .map(row => `${row.response} - ${getResponseCodeText(row.response)}`)))
                .sort((a, b) => {
                  const codeA = parseInt(a.split(' - ')[0]);
                  const codeB = parseInt(b.split(' - ')[0]);
                  return codeA - codeB;
                })
                .map((responseCode, index) => (
                  <div key={index} className="text-center py-1">
                    {responseCode}
                  </div>
                ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard title="Unique Stream Error Codes" valueColor="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analysisData?.uniqueErrorCodes || 0}
          </div>
          {analysisData?.data && (
            <div className="text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto pr-2">
              {Array.from(new Set(analysisData.data
                .filter(row => {
                  const responseCode = parseInt(row.response);
                  return responseCode >= 400 && responseCode < 500 && row.error_code;
                })
                .map(row => {
                  const errorCode = parseInt(row.error_code);
                  return `${errorCode} - ${ERROR_CODES[errorCode]?.name || 'Unknown error code'}`;
                })))
                .sort((a, b) => {
                  const codeA = parseInt(a.split(' - ')[0]);
                  const codeB = parseInt(b.split(' - ')[0]);
                  return codeA - codeB;
                })
                .map((errorCode, index) => (
                  <div key={index} className="text-center py-1">
                    {errorCode}
                  </div>
                ))}
            </div>
          )}
        </DashboardCard>

        {/* SDK Versions Card */}
        <SDKVersionsCard versions={analysisData?.sdkVersions} />
      </div>

      {/* <div className="grid grid-cols-1 gap-6 mb-8">
        <SDKVersionsCard versions={analysisData?.sdkVersions} />
      </div> */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Error Distribution Chart */}
        <DashboardCard title="4xx Error Distribution">
          {analysisData?.errorDistribution && analysisData.errorDistribution.length > 0 ? (
            <ErrorDistributionChart data={analysisData.errorDistribution} />
          ) : (
            <p className="text-sm text-gray-500">No error distribution data available</p>
          )}
        </DashboardCard>

        {/* Client Type Distribution Chart */}
        <DashboardCard title="Error Distribution by Client Type">
          {analysisData?.clientTypeDistribution && analysisData.clientTypeDistribution.length > 0 ? (
            <ClientTypeDistributionChart data={analysisData.clientTypeDistribution} />
          ) : (
            <p className="text-sm text-gray-500">No client type distribution data available</p>
          )}
        </DashboardCard>
      </div>

      {/* SDK Error Distribution Chart */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <DashboardCard title="Error Distribution by SDK Type and Error Code">
          {analysisData?.sdkErrorDistribution && analysisData.sdkErrorDistribution.length > 0 ? (
            <SDKErrorDistributionChart data={analysisData.sdkErrorDistribution} />
          ) : (
            <p className="text-sm text-gray-500">No SDK error distribution data available</p>
          )}
        </DashboardCard>
      </div>

      {/* Detailed Error Groups Table */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <DashboardCard title="Detailed Error Groups Table">
          {analysisData?.data && analysisData.data.length > 0 ? (
            <DetailedErrorGroupsTable errorGroups={extractErrorGroups(analysisData.data)} />
          ) : (
            <p className="text-sm text-gray-500">No error group data available</p>
          )}
        </DashboardCard>
      </div>

      {validationResult && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{validationResult.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900">Logs Integration Review</h1>
          <p className="mt-2 text-gray-600">Upload your CSV file to run the Health Check</p>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          {!analysisData ? renderUploadArea() : renderDashboard()}
        </div>
      </div>
    </div>
  );
}

export default App;
