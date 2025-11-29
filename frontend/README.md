# Earthquake Data Frontend

React-based frontend for visualizing and analyzing earthquake data.

## Features

- **Interactive Map** with earthquake markers sized and colored by magnitude
- **Multiple Chart Types**:
  - Magnitude distribution histogram
  - Magnitude vs depth scatter plot
  - Timeline showing earthquake frequency over time
- **Advanced Filtering** by magnitude range and location
- **Sortable Data Table** with pagination
- **Statistics Dashboard** showing key metrics
- **Responsive Design** that works on desktop and mobile

## Tech Stack

- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (charts and graphs)
- Leaflet & React-Leaflet (interactive maps)
- Axios (API communication)
- date-fns (date formatting)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` to set your API URL (default: `http://localhost:8000`)

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EarthquakeMap.jsx       # Interactive Leaflet map
│   │   ├── MagnitudeChart.jsx      # Magnitude distribution chart
│   │   ├── DepthChart.jsx          # Magnitude vs depth scatter plot
│   │   ├── TimelineChart.jsx       # Timeline chart
│   │   ├── StatisticsCard.jsx      # Statistics display cards
│   │   ├── FilterPanel.jsx         # Filtering controls
│   │   └── EarthquakeTable.jsx     # Sortable data table
│   ├── services/
│   │   └── api.js                  # API service layer
│   ├── utils/
│   │   └── formatters.js           # Data formatting utilities
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── package.json                    # Dependencies and scripts
```

## Components

### EarthquakeMap
Interactive map showing earthquake locations with:
- Markers sized by magnitude
- Color-coded by magnitude intensity
- Popup info on click
- Auto-fit bounds to show all earthquakes

### Charts
Three visualization types:
1. **MagnitudeChart**: Bar chart of earthquake count by magnitude range
2. **DepthChart**: Scatter plot showing relationship between magnitude and depth
3. **TimelineChart**: Line chart showing earthquake frequency over time

### FilterPanel
Control panel for:
- Scraping new data from USGS
- Filtering by magnitude range
- Searching by location
- Resetting filters

### EarthquakeTable
Data table with:
- Sortable columns
- Pagination (10 items per page)
- Detailed earthquake information
- Links to USGS pages

### StatisticsCard
Dashboard cards showing:
- Total earthquake count
- Maximum magnitude
- Average magnitude
- Tsunami event count

## API Service

The `api.js` service provides methods for:
- `scrapeData(timeRange)` - Fetch new data from USGS
- `getAllEarthquakes(limit)` - Get all earthquakes
- `getRecentEarthquakes(hours)` - Get recent earthquakes
- `getEarthquakesByMagnitude(min, max)` - Filter by magnitude
- `getEarthquakesByLocation(location)` - Search by location
- `getStatistics()` - Get statistics

## Utility Functions

### formatters.js
Data formatting utilities:
- `formatTimestamp(timestamp)` - Format full date/time
- `formatTimeAgo(timestamp)` - Relative time (e.g., "2 hours ago")
- `formatMagnitude(magnitude)` - Format to 1 decimal place
- `formatDepth(depth)` - Format depth in km
- `formatCoordinates(lat, lon)` - Format coordinates
- `getMagnitudeColor(magnitude)` - Color based on magnitude
- `getMagnitudeLabel(magnitude)` - Label (e.g., "Major", "Moderate")
- `getAlertColor(alert)` - Color based on alert level

## Styling

The app uses Tailwind CSS for styling with a custom color scheme:
- Primary color: Blue (#3B82F6)
- Background: Gray (#F3F4F6)
- Magnitude colors: Green (low) to Red (high)

## Configuration

### Environment Variables
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

### Vite Configuration
The `vite.config.js` file contains build and dev server settings.

### Tailwind Configuration
The `tailwind.config.js` file defines the design system and enabled features.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- Map functionality requires JavaScript enabled

## Performance Optimization

- Code splitting by route
- Lazy loading of map tiles
- Pagination for large datasets
- Memoization of expensive calculations

## Troubleshooting

### Map not displaying
- Check that Leaflet CSS is loaded
- Verify latitude/longitude values are valid

### API errors
- Ensure backend server is running
- Check `VITE_API_URL` in `.env`
- Verify CORS settings in backend

### Charts not rendering
- Check data format matches expected structure
- Verify Recharts is installed
- Look for console errors

## Development Tips

1. Use React DevTools for debugging
2. Check Network tab for API issues
3. Use the browser console to inspect data
4. Test with different datasets (hour, day, week, month)

## Future Enhancements

Potential improvements:
- Real-time updates with WebSockets
- Export data to CSV/JSON
- Custom date range selection
- Heat map visualization
- Earthquake predictions/alerts
- User accounts and saved searches
- Mobile app version
