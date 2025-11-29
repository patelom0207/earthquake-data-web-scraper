# Earthquake Data Web Scraper & Visualization Platform

A full-stack application for scraping, storing, and visualizing earthquake data from the USGS (United States Geological Survey) Earthquake Hazards Program.

## Features

### Backend
- **FastAPI REST API** for earthquake data management
- **USGS API Integration** with support for multiple time ranges (hour, day, week, month)
- **SQLite Database** for persistent data storage
- **Advanced Filtering** by magnitude, location, and time
- **Statistics & Analytics** endpoints
- **Comprehensive Data Model** with 30+ earthquake attributes

### Frontend
- **Interactive Map Visualization** using Leaflet
- **Multiple Chart Types**:
  - Magnitude distribution bar chart
  - Magnitude vs Depth scatter plot
  - Timeline chart showing earthquake frequency
- **Advanced Filtering** with real-time updates
- **Sortable Data Table** with pagination
- **Statistics Dashboard** with key metrics
- **Responsive Design** with Tailwind CSS

## Project Structure

```
earthquake-data-web-scraper/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── scraper.py       # USGS data scraper
│   │   └── database.py      # SQLite database manager
│   ├── data/                # Database storage
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application
│   ├── package.json
│   └── vite.config.js
│
└── Earthquake_Data_Web_Scraper.ipynb  # Original notebook
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create the data directory:
```bash
mkdir -p data
```

5. Start the backend server:
```bash
cd app
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### Scraping Data

1. Open the web interface at `http://localhost:5173`
2. Select a time range (hour, day, week, or month)
3. Click "Scrape New Data" to fetch earthquake data from USGS
4. Data will be automatically saved to the database

### Filtering Data

Use the filter panel to:
- Filter by minimum/maximum magnitude
- Search by location
- View recent earthquakes from specific time periods

### Visualizations

Switch between three view modes:
- **Map View**: Interactive map showing earthquake locations with magnitude-based markers
- **Charts**: Statistical visualizations including magnitude distribution, depth analysis, and timeline
- **Table View**: Sortable, paginated table with detailed earthquake information

## API Endpoints

### GET /
Get API information and available endpoints

### POST /scrape
Scrape new earthquake data from USGS
```json
{
  "time_range": "day"  // hour, day, week, or month
}
```

### GET /earthquakes
Get all earthquakes (optional limit parameter)

### GET /earthquakes/recent?hours=24
Get earthquakes from the last N hours

### GET /earthquakes/magnitude?min_magnitude=5.0&max_magnitude=7.0
Filter earthquakes by magnitude range

### GET /earthquakes/location?location=California
Search earthquakes by location

### GET /statistics
Get database statistics

### DELETE /earthquakes/old?days=30
Clear earthquake data older than N days

## Data Model

Each earthquake record includes:
- **Basic Info**: ID, title, location, time
- **Magnitude**: Value and type
- **Location**: Latitude, longitude, depth
- **Impact**: Felt reports, tsunami warning, alert level
- **Technical**: Network, sources, gap, RMS
- **Links**: USGS detail page and additional information

## Technologies Used

### Backend
- FastAPI
- SQLite3
- Python urllib (for USGS API calls)
- Uvicorn (ASGI server)

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts (for charts)
- Leaflet & React-Leaflet (for maps)
- Axios (for API calls)
- date-fns (for date formatting)

## Development

### Backend Development
```bash
cd backend/app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Data Source

Earthquake data is sourced from the [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/), which provides real-time and historical earthquake information.

## Acknowledgments

- USGS for providing comprehensive earthquake data
- OpenStreetMap for map tiles
- The open-source community for the amazing tools and libraries
