# Quick Start Guide

Get up and running with the Earthquake Data Visualization Platform in minutes!

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create data directory
mkdir -p data

# Start the backend server
cd app
python main.py
```

The backend will start at `http://localhost:8000`

### Step 2: Frontend Setup (3 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### Step 3: Use the Application

1. Open your browser to `http://localhost:5173`
2. Click **"Scrape New Data"** to fetch earthquake data from USGS
3. Explore the data using:
   - **Map View**: See earthquakes on an interactive map
   - **Charts**: Visualize magnitude distribution, depth, and timeline
   - **Table View**: Browse detailed earthquake information

## First-Time Usage Tips

### Scraping Data
- Start with "Last Day" to get a reasonable amount of data
- Click "Scrape New Data" button in the filter panel
- Wait for the success message

### Filtering
- Use magnitude filters to focus on significant earthquakes (e.g., min: 4.0)
- Search by location (e.g., "California", "Japan", "Alaska")
- Reset filters anytime with the "Reset Filters" button

### Viewing Data
- **Map**: Click markers for detailed earthquake info
- **Charts**: Hover over data points for details
- **Table**: Click column headers to sort, use pagination to browse

## Common Issues

### Backend won't start
- Make sure you're in the `backend/app` directory
- Check that port 8000 is not already in use
- Verify Python 3.8+ is installed: `python --version`

### Frontend shows API errors
- Ensure the backend is running at `http://localhost:8000`
- Check the backend terminal for errors
- Try refreshing the page

### Map not displaying
- Make sure you have an internet connection (for map tiles)
- Check browser console for errors
- Try a different browser

### No data showing
- Click "Scrape New Data" first
- Check that the scrape was successful (look for success message)
- Try reloading the page

## Next Steps

- Read the [main README](README.md) for detailed documentation
- Check [backend README](backend/README.md) for API documentation
- Check [frontend README](frontend/README.md) for component details
- Explore the API documentation at `http://localhost:8000/docs`

## Stopping the Application

Press `Ctrl+C` in both terminal windows to stop the servers.

## Production Deployment

For production deployment:
1. Build the frontend: `cd frontend && npm run build`
2. Serve the frontend with nginx or similar
3. Run backend with gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
4. Use a reverse proxy for the backend
5. Set up proper CORS origins in backend configuration

Happy earthquake tracking! 🌍
