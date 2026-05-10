import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';

function CustomDot(props) {
  const { cx, cy, payload, color } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill={color || '#7c3aed'}
      stroke="none"
    />
  );
}

export default function PressureChart({ data, tensionColor }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-text-muted text-xs italic">Chart updates with each ball</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="ball"
          tick={{ fill: '#7777aa', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
          label={{
            value: 'Ball',
            position: 'insideBottomRight',
            offset: -5,
            fill: '#444466',
            fontSize: 10,
          }}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#7777aa', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#13132a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#e8e8f0',
            fontSize: '12px',
          }}
          labelFormatter={(v) => `Ball ${v}`}
          formatter={(v) => [`${v}`, 'Pressure']}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke={tensionColor || '#7c3aed'}
          strokeWidth={2}
          dot={(props) => <CustomDot {...props} color={tensionColor} />}
          activeDot={{ r: 5, fill: tensionColor }}
          isAnimationActive={true}
          animationDuration={300}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
