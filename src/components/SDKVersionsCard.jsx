import React from 'react';
import DashboardCard from './DashboardCard';

const SDKVersionsCard = ({ versions }) => {
    if (!versions || Object.keys(versions).length === 0) {
        return (
            <DashboardCard title="SDK Versions">
                <p className="text-sm text-gray-500">No SDK version data available</p>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Latest SDK Versions">
            <div className="h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                    {Object.entries(versions).map(([sdk, version]) => (
                        <div key={sdk} className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 capitalize truncate mr-2">
                                {sdk.replace(/-/g, ' ')}
                            </span>
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                v{version}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardCard>
    );
};

export default SDKVersionsCard; 