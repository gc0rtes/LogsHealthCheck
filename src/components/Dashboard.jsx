import { formatDate, calculateDuration } from '../utils/dateFormatters';
import { getResponseCodeText } from '../utils/httpStatusCodes';
import { ERROR_CODES } from '../utils/StreamErrorCodes';
import { extractErrorGroups } from '../utils/errorGroupsExtractor';
import DashboardCard from './DashboardCard';
import ErrorDistributionChart from './ErrorDistributionChart';
import ClientTypeDistributionChart from './ClientTypeDistributionChart';
import SDKErrorDistributionChart from './SDKErrorDistributionChart';
import SDKVersionsCard from './SDKVersionsCard';
import DetailedErrorGroupsTable from './DetailedErrorGroupsTable';
import SuccessMessage from './SuccessMessage';

const Dashboard = ({ analysisData, validationResult, onNewUpload }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-center mb-8">
                <button
                    onClick={onNewUpload}
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

                <SDKVersionsCard versions={analysisData?.sdkVersions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <DashboardCard title="4xx Error Distribution">
                    {analysisData?.errorDistribution && analysisData.errorDistribution.length > 0 ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <ErrorDistributionChart data={analysisData.errorDistribution} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No error distribution data available</p>
                    )}
                </DashboardCard>

                <DashboardCard title="Error Distribution by Client Type">
                    {analysisData?.clientTypeDistribution && analysisData.clientTypeDistribution.length > 0 ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <ClientTypeDistributionChart data={analysisData.clientTypeDistribution} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No client type distribution data available</p>
                    )}
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <DashboardCard title="Error Distribution by SDK Type and Error Code">
                    {analysisData?.sdkErrorDistribution && analysisData.sdkErrorDistribution.length > 0 ? (
                        <SDKErrorDistributionChart data={analysisData.sdkErrorDistribution} />
                    ) : (
                        <p className="text-sm text-gray-500">No SDK error distribution data available</p>
                    )}
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <DashboardCard title="Detailed Error Groups Table">
                    {analysisData?.data && analysisData.data.length > 0 ? (
                        <DetailedErrorGroupsTable errorGroups={extractErrorGroups(analysisData.data)} />
                    ) : (
                        <p className="text-sm text-gray-500">No error group data available</p>
                    )}
                </DashboardCard>
            </div>

            {validationResult && <SuccessMessage message={validationResult.message} />}
        </div>
    );
};

export default Dashboard; 