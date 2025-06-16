import React from 'react';
import DashboardCard from './DashboardCard';

const SDKVersionsCard = ({ versions }) => {
    if (!versions || Object.keys(versions).length === 0) {
        return (
            <DashboardCard title="Latest SDK Versions" valueColor="text-center">
                <p className="text-sm text-gray-500">No SDK version data available</p>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Latest SDK Versions" valueColor="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
                {Object.keys(versions).length}
            </div>
            <div className="text-sm text-gray-600 space-y-1 max-h-48 overflow-y-auto pr-2">
                {Object.entries(versions)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([sdkType, version]) => (
                        <div key={sdkType} className="text-center py-1">
                            {sdkType}: {version}
                        </div>
                    ))}
            </div>
        </DashboardCard>
    );
};

export default SDKVersionsCard; 