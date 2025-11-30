import { useState } from 'react';

export default function FilterPanel({ onFilterChange, onScrape, onClearData, isLoading }) {
  const [filters, setFilters] = useState({
    minMagnitude: '',
    maxMagnitude: '',
    location: '',
    hours: '24',
  });

  const [timeRange, setTimeRange] = useState('day');

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      minMagnitude: '',
      maxMagnitude: '',
      location: '',
      hours: '24',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleScrape = () => {
    onScrape(timeRange);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all earthquake data? This cannot be undone.')) {
      onClearData();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Data Controls</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleScrape}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Scraping...' : 'Scrape New Data'}
          </button>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClearData}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-3">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Magnitude
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={filters.minMagnitude}
            onChange={(e) => handleFilterChange('minMagnitude', e.target.value)}
            placeholder="e.g., 2.5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Magnitude
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={filters.maxMagnitude}
            onChange={(e) => handleFilterChange('maxMagnitude', e.target.value)}
            placeholder="e.g., 7.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="e.g., California"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
