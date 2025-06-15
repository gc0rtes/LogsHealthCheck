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

const SDKErrorDistributionChart = ({ data }) => {
    // Get all unique error codes from the data
    const errorCodes = [...new Set(
        data.flatMap(item =>
            Object.keys(item).filter(key => key !== 'sdkType')
        )
    )].filter(Boolean);

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
                    <Tooltip />
                    <Legend />
                    {errorCodes.map((errorCode, index) => (
                        <Bar
                            key={errorCode}
                            dataKey={errorCode}
                            stackId="a"
                            fill={`hsl(${(index * 360) / errorCodes.length}, 70%, 50%)`}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SDKErrorDistributionChart; 