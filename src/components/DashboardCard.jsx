import React from 'react';

const DashboardCard = ({ title, children, valueColor = 'text-gray-900' }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <div className={valueColor}>
                {children}
            </div>
        </div>
    );
};

export default DashboardCard; 