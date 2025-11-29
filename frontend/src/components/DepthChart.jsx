import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { getMagnitudeColor } from '../utils/formatters';

export default function DepthChart({ earthquakes }) {
  const data = earthquakes
    .filter((eq) => eq.magnitude !== null && eq.depth !== null)
    .map((eq) => ({
      magnitude: eq.magnitude,
      depth: eq.depth,
      location: eq.location,
      color: getMagnitudeColor(eq.magnitude),
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold">{data.location}</p>
          <p>Magnitude: {data.magnitude?.toFixed(1)}</p>
          <p>Depth: {data.depth?.toFixed(2)} km</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Magnitude vs Depth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="magnitude"
            name="Magnitude"
            label={{ value: 'Magnitude', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="depth"
            name="Depth"
            label={{ value: 'Depth (km)', angle: -90, position: 'insideLeft' }}
            reversed
          />
          <ZAxis range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Earthquakes" data={data} fill="#8884d8">
            {data.map((entry, index) => (
              <circle key={`dot-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
