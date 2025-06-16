import React, { useState } from 'react';

const getResponseCodeText = (code) => {
    const codes = {
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '408': 'Request Timeout',
        '413': 'Payload Too Large',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large'
    };
    return codes[code] || '';
};

const DetailedErrorGroupsTable = ({ errorGroups }) => {
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (key) => {
        setExpandedRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left">API Response code</th>
                        <th className="px-4 py-2 text-left">Stream Error Code</th>
                        <th className="px-4 py-2 text-left">Count</th>
                        <th className="px-4 py-2 text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {errorGroups.map((group) => {
                        const key = `${group.responseCode}-${group.errorCode}`;
                        const isExpanded = expandedRows[key];
                        return (
                            <React.Fragment key={key}>
                                <tr
                                    className="cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => toggleRow(key)}
                                    data-testid={`expand-row-${key}`}
                                >
                                    <td className="px-4 py-2 font-medium text-blue-700 flex items-center gap-2">
                                        <span>{group.responseCode}</span>
                                        <span className="text-xs text-gray-500">
                                            {getResponseCodeText(group.responseCode)}
                                        </span>
                                        <span className="ml-2 text-xs text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {group.errorCode} - {group.name}
                                    </td>
                                    <td className="px-4 py-2">{group.count}</td>
                                    <td className="px-4 py-2">{group.description}</td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={4} className="px-6 py-3">
                                            <div>
                                                <div className="font-semibold mb-2">Operation Types</div>
                                                <table className="min-w-full text-sm border">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-2 py-1 text-left">Operation Type</th>
                                                            <th className="px-2 py-1 text-left">Count</th>
                                                            <th className="px-2 py-1 text-left">Example Error Message</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {group.operationTypes.map((op) => (
                                                            <tr key={op.type}>
                                                                <td className="px-2 py-1 font-medium">{op.type}</td>
                                                                <td className="px-2 py-1">{op.count}</td>
                                                                <td className="px-2 py-1 text-gray-600">{op.exampleMessage}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DetailedErrorGroupsTable; 