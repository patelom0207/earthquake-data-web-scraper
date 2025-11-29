# Earthquake Data Backend

FastAPI backend for scraping and managing earthquake data from USGS.

## Features

- RESTful API with FastAPI
- USGS Earthquake API integration
- SQLite database for data persistence
- Advanced filtering and search capabilities
- Statistics and analytics endpoints
- CORS enabled for frontend integration

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create data directory:
```bash
mkdir -p data
```

## Running the Server

### Development Mode
```bash
cd app
python main.py
```

The server will start at `http://localhost:8000` with auto-reload enabled.

### Production Mode
```bash
cd app
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Health & Info
- `GET /` - API information
- `GET /health` - Health check

### Data Scraping
- `POST /scrape` - Scrape new earthquake data
  - Body: `{"time_range": "day"}` (hour, day, week, month)

### Earthquake Data
- `GET /earthquakes` - Get all earthquakes
  - Query: `?limit=100` (optional)
- `GET /earthquakes/recent` - Get recent earthquakes
  - Query: `?hours=24`
- `GET /earthquakes/magnitude` - Filter by magnitude
  - Query: `?min_magnitude=5.0&max_magnitude=7.0`
- `GET /earthquakes/location` - Search by location
  - Query: `?location=California`

### Analytics
- `GET /statistics` - Get database statistics

### Maintenance
- `DELETE /earthquakes/old` - Clear old data
  - Query: `?days=30`

## Module Documentation

### scraper.py
Contains the `EarthquakeScraper` class for fetching and parsing USGS data.

**Key Methods:**
- `fetch_data(time_range)` - Fetch data from USGS API
- `filter_by_magnitude(min, max)` - Filter by magnitude range
- `filter_by_location(query)` - Search by location
- `get_statistics()` - Calculate statistics

### database.py
Contains the `EarthquakeDatabase` class for SQLite operations.

**Key Methods:**
- `save_earthquakes(data, time_range)` - Save earthquake records
- `get_all_earthquakes(limit)` - Retrieve all earthquakes
- `get_earthquakes_by_magnitude(min, max)` - Filter by magnitude
- `get_earthquakes_by_location(location)` - Search by location
- `get_statistics()` - Get database statistics
- `clear_old_data(days)` - Remove old records

### main.py
FastAPI application with all REST endpoints and CORS configuration.

## Database Schema

### earthquakes table
Stores earthquake events with fields:
- id (PRIMARY KEY)
- title, magnitude, location
- time, updated, timezone
- latitude, longitude, depth
- tsunami, alert, status
- Technical fields (gap, rms, nst, etc.)
- Network info (net, code, sources)

### scrape_history table
Tracks scraping operations:
- id, time_range, record_count
- scraped_at timestamp

## Environment Variables

Create a `.env` file (optional):
```env
PORT=8000
HOST=0.0.0.0
DATABASE_PATH=data/earthquakes.db
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad request (invalid parameters)
- 404: Not found
- 500: Server error

All errors include descriptive messages in the response.

## CORS Configuration

CORS is configured to allow all origins for development. For production, update the `allow_origins` list in `main.py`.

## Data Retention

Use the `DELETE /earthquakes/old` endpoint to remove old data and keep the database size manageable.

## Performance Considerations

- Database queries use indexes on frequently filtered fields
- Pagination support via limit parameter
- Efficient INSERT OR REPLACE for duplicate handling

## Testing

Test the API using:
- Interactive docs at `/docs`
- curl commands
- Postman or similar tools

Example:
```bash
# Health check
curl http://localhost:8000/health

# Scrape data
curl -X POST http://localhost:8000/scrape \
  -H "Content-Type: application/json" \
  -d '{"time_range": "day"}'

# Get earthquakes
curl http://localhost:8000/earthquakes?limit=10

# Get statistics
curl http://localhost:8000/statistics
```
