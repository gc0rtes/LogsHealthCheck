import { useState, useEffect } from 'react'
import { validateCSVFields, analyzeCSVData } from './utils/csvValidation'
import UploadArea from './components/UploadArea'
import Dashboard from './components/Dashboard'

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

  const handleNewUpload = () => {
    setValidationResult(null);
    setAnalysisData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900">Logs Integration Review</h1>
          <p className="mt-2 text-gray-600">Upload your CSV file to run the Health Check</p>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          {!analysisData ? (
            <UploadArea onDrop={onDrop} error={error} />
          ) : (
            <Dashboard
              analysisData={analysisData}
              validationResult={validationResult}
              onNewUpload={handleNewUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
