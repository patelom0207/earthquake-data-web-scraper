import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

export default function TimelineChart({ earthquakes }) {
  const getTimelineData = () => {
    const hourlyData = {};

    earthquakes.forEach((eq) => {
      if (!eq.time || eq.magnitude === null) return;

      const date = new Date(eq.time);
      const hourKey = format(date, 'MMM dd HH:00');

      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = {
          time: hourKey,
          count: 0,
          maxMagnitude: 0,
          avgMagnitude: 0,
          total: 0,
        };
      }

      hourlyData[hourKey].count++;
      hourlyData[hourKey].total += eq.magnitude;
      hourlyData[hourKey].maxMagnitude = Math.max(
        hourlyData[hourKey].maxMagnitude,
        eq.magnitude
      );
    });

    return Object.values(hourlyData)
      .map((hour) => ({
        ...hour,
        avgMagnitude: hour.total / hour.count,
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const data = getTimelineData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Earthquake Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Magnitude', angle: 90, position: 'insideRight' }}
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            name="Earthquake Count"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="maxMagnitude"
            stroke="#DC2626"
            name="Max Magnitude"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
