import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ERROR_CODES } from '../utils/StreamErrorCodes';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

const SDKErrorDistributionChart = ({ data }) => {
    // Get all unique error codes from the data
    const errorCodes = [...new Set(
        data.flatMap(item =>
            Object.keys(item).filter(key => key !== 'sdkType')
        )
    )].filter(Boolean);

    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {ERROR_CODES[entry.name]?.name || entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <h3>Error Distribution by SDK Type and Error Code</h3>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sdkType" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        formatter={(value) => ERROR_CODES[value]?.name || value}
                    />
                    {errorCodes.map((errorCode, index) => (
                        <Bar
                            key={errorCode}
                            dataKey={errorCode}
                            stackId="a"
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SDKErrorDistributionChart; 