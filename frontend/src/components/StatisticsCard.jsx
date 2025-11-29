import React from 'react';
import { formatMagnitude } from '../utils/formatters';

export default function StatisticsCard({ statistics, earthquakeCount }) {
  const stats = [
    {
      label: 'Total Earthquakes',
      value: earthquakeCount || 0,
      icon: '🌍',
    },
    {
      label: 'Max Magnitude',
      value: statistics?.magnitude_max ? formatMagnitude(statistics.magnitude_max) : 'N/A',
      icon: '⚡',
    },
    {
      label: 'Avg Magnitude',
      value: statistics?.magnitude_avg ? formatMagnitude(statistics.magnitude_avg) : 'N/A',
      icon: '📊',
    },
    {
      label: 'Tsunami Events',
      value: statistics?.tsunami_events || 0,
      icon: '🌊',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <div className="text-4xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
