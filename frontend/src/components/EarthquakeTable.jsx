import React, { useState } from 'react';
import { formatTimestamp, formatTimeAgo, formatMagnitude, formatDepth, getMagnitudeColor } from '../utils/formatters';

export default function EarthquakeTable({ earthquakes }) {
  const [sortField, setSortField] = useState('time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedEarthquakes = [...earthquakes].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedEarthquakes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEarthquakes = sortedEarthquakes.slice(startIndex, startIndex + itemsPerPage);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="text-gray-400">⇅</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-xl font-bold">Earthquake Data Table</h3>
        <p className="text-sm text-gray-600 mt-1">
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedEarthquakes.length)} of {sortedEarthquakes.length} earthquakes
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('magnitude')}
              >
                Magnitude <SortIcon field="magnitude" />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('location')}
              >
                Location <SortIcon field="location" />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('depth')}
              >
                Depth <SortIcon field="depth" />
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('time')}
              >
                Time <SortIcon field="time" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedEarthquakes.map((earthquake, index) => (
              <tr
                key={earthquake.id}
                className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3">
                  <span
                    className="font-bold text-lg"
                    style={{ color: getMagnitudeColor(earthquake.magnitude) }}
                  >
                    {formatMagnitude(earthquake.magnitude)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{earthquake.location || 'N/A'}</td>
                <td className="px-4 py-3 text-sm">{formatDepth(earthquake.depth)}</td>
                <td className="px-4 py-3 text-sm">
                  <div>{formatTimeAgo(earthquake.time)}</div>
                  <div className="text-xs text-gray-500">{formatTimestamp(earthquake.time)}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    {earthquake.tsunami === 1 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Tsunami
                      </span>
                    )}
                    {earthquake.alert && (
                      <span className={`px-2 py-1 bg-${earthquake.alert}-100 text-${earthquake.alert}-700 text-xs rounded uppercase`}>
                        {earthquake.alert}
                      </span>
                    )}
                    {earthquake.url && (
                      <a
                        href={earthquake.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        USGS →
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
