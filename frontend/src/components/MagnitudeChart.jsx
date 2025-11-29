import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getMagnitudeColor } from '../utils/formatters';

export default function MagnitudeChart({ earthquakes }) {
  const getMagnitudeDistribution = () => {
    const ranges = {
      '0-2': 0,
      '2-3': 0,
      '3-4': 0,
      '4-5': 0,
      '5-6': 0,
      '6-7': 0,
      '7+': 0,
    };

    earthquakes.forEach((eq) => {
      const mag = eq.magnitude;
      if (mag === null || mag === undefined) return;

      if (mag < 2) ranges['0-2']++;
      else if (mag < 3) ranges['2-3']++;
      else if (mag < 4) ranges['3-4']++;
      else if (mag < 5) ranges['4-5']++;
      else if (mag < 6) ranges['5-6']++;
      else if (mag < 7) ranges['6-7']++;
      else ranges['7+']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
      magnitude: parseFloat(range.split('-')[0]) || 7,
    }));
  };

  const data = getMagnitudeDistribution();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Magnitude Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" label={{ value: 'Magnitude Range', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Number of Earthquakes">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getMagnitudeColor(entry.magnitude)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
