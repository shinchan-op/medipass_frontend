import React, { memo } from 'react';
import { Theme } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';

interface BloodPressureChartProps {
  data: any[];
  config: {
    name: string;
    unit: string;
    lines: { dataKey: string; stroke: string }[];
    yAxisDomain: number[];
  };
  isMobile: boolean;
  theme: Theme;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        fontSize: '12px',
        maxWidth: '150px'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '2px 0', color: entry.color }}>
            {`${entry.name}: ${entry.value} mmHg`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Format date for X-axis
const formatXAxis = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ data, config, isMobile, theme }) => {
  // Make sure we have data to display
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: theme.palette.text.secondary,
        fontSize: '14px'
      }}>
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="99%" height="99%" debounce={50}>
      <LineChart
        data={data}
        margin={{ 
          top: 10, 
          right: isMobile ? 10 : 20, 
          left: isMobile ? -15 : 0, 
          bottom: 0 
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isMobile ? "rgba(0,0,0,0.05)" : "#f0f0f0"} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: isMobile ? 9 : 11 }} 
          tickMargin={isMobile ? 5 : 8}
          tickFormatter={formatXAxis}
          interval={isMobile ? "preserveStartEnd" : 0}
          tickCount={isMobile ? 4 : undefined}
          height={isMobile ? 20 : 30}
        />
        <YAxis 
          domain={config.yAxisDomain}
          tick={{ fontSize: isMobile ? 9 : 11 }} 
          tickMargin={isMobile ? 5 : 8}
          width={isMobile ? 25 : 30}
          tickCount={isMobile ? 4 : 6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          name="Systolic" 
          type="monotone" 
          dataKey="systolic" 
          stroke={theme.palette.error.main} 
          strokeWidth={isMobile ? 1.5 : 2}
          dot={{ r: isMobile ? 0 : 2 }}
          activeDot={{ r: isMobile ? 3 : 5 }}
          isAnimationActive={false}
        />
        <Line 
          name="Diastolic" 
          type="monotone" 
          dataKey="diastolic" 
          stroke={theme.palette.primary.main} 
          strokeWidth={isMobile ? 1.5 : 2}
          dot={{ r: isMobile ? 0 : 2 }}
          activeDot={{ r: isMobile ? 3 : 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Use memo to prevent unnecessary re-renders of the chart
export default memo(BloodPressureChart); 