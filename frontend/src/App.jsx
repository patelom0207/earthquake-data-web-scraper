import { useState, useEffect } from 'react';
import { earthquakeAPI } from './services/api';
import EarthquakeMap from './components/EarthquakeMap';
import MagnitudeChart from './components/MagnitudeChart';
import DepthChart from './components/DepthChart';
import TimelineChart from './components/TimelineChart';
import StatisticsCard from './components/StatisticsCard';
import FilterPanel from './components/FilterPanel';
import EarthquakeTable from './components/EarthquakeTable';
import './App.css';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('map');

  useEffect(() => {
    loadEarthquakes();
    loadStatistics();
  }, []);

  const loadEarthquakes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await earthquakeAPI.getAllEarthquakes();
      setEarthquakes(response.data || []);
      setFilteredEarthquakes(response.data || []);
    } catch (err) {
      setError('Failed to load earthquake data. Make sure the backend server is running.');
      console.error('Error loading earthquakes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await earthquakeAPI.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const handleScrape = async (timeRange) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await earthquakeAPI.scrapeData(timeRange);
      await loadEarthquakes();
      await loadStatistics();
      alert(`Successfully scraped ${result.records_saved} earthquakes!`);
    } catch (err) {
      setError('Failed to scrape data. Make sure the backend server is running.');
      console.error('Error scraping data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await earthquakeAPI.clearAllData();
      await loadEarthquakes();
      await loadStatistics();
      alert(`Successfully cleared ${result.deleted_count} earthquake records!`);
    } catch (err) {
      setError('Failed to clear data. Make sure the backend server is running.');
      console.error('Error clearing data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...earthquakes];

    if (filters.minMagnitude) {
      filtered = filtered.filter((eq) => eq.magnitude >= parseFloat(filters.minMagnitude));
    }

    if (filters.maxMagnitude) {
      filtered = filtered.filter((eq) => eq.magnitude <= parseFloat(filters.maxMagnitude));
    }

    if (filters.location) {
      filtered = filtered.filter((eq) =>
        eq.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredEarthquakes(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🌍 Earthquake Data Dashboard</h1>
          <p className="text-blue-100 mt-2">Real-time earthquake monitoring and visualization</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <FilterPanel
          onFilterChange={handleFilterChange}
          onScrape={handleScrape}
          onClearData={handleClearData}
          isLoading={isLoading}
        />

        <StatisticsCard
          statistics={statistics}
          earthquakeCount={filteredEarthquakes.length}
        />

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 px-6 py-3 font-semibold ${
                  activeTab === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🗺️ Map View
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex-1 px-6 py-3 font-semibold ${
                  activeTab === 'charts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Charts
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 px-6 py-3 font-semibold ${
                  activeTab === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📋 Table View
              </button>
            </div>

            <div className="p-6">
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading earthquake data...</p>
                </div>
              )}

              {!isLoading && filteredEarthquakes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No earthquake data available. Click "Scrape New Data" to fetch the latest data.
                  </p>
                </div>
              )}

              {!isLoading && filteredEarthquakes.length > 0 && (
                <>
                  {activeTab === 'map' && <EarthquakeMap earthquakes={filteredEarthquakes} />}

                  {activeTab === 'charts' && (
                    <div className="space-y-6">
                      <TimelineChart earthquakes={filteredEarthquakes} />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MagnitudeChart earthquakes={filteredEarthquakes} />
                        <DepthChart earthquakes={filteredEarthquakes} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'table' && <EarthquakeTable earthquakes={filteredEarthquakes} />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Data source: USGS Earthquake Hazards Program</p>
          <p className="text-sm text-gray-400 mt-2">
            Built with React, FastAPI, and Leaflet
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
