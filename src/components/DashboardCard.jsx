import React from 'react';

const DashboardCard = ({ title, children, valueColor }) => {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">{title}</h3>
                <div className={valueColor || "mt-2"}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardCard; 