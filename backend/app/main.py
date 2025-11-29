from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os

from scraper import EarthquakeScraper
from database import EarthquakeDatabase


app = FastAPI(
    title="Earthquake Data API",
    description="API for scraping and retrieving earthquake data from USGS",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = EarthquakeDatabase(db_path="../data/earthquakes.db")


class EarthquakeResponse(BaseModel):
    id: str
    title: Optional[str]
    magnitude: Optional[float]
    location: Optional[str]
    time: Optional[int]
    longitude: Optional[float]
    latitude: Optional[float]
    depth: Optional[float]
    tsunami: Optional[int]
    alert: Optional[str]
    status: Optional[str]


class ScrapeRequest(BaseModel):
    time_range: str = "day"


class StatisticsResponse(BaseModel):
    total_earthquakes: int
    magnitude_min: Optional[float]
    magnitude_max: Optional[float]
    magnitude_avg: Optional[float]
    tsunami_events: int
    unique_locations: int


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Earthquake Data API",
        "version": "1.0.0",
        "endpoints": {
            "GET /earthquakes": "Get all earthquakes",
            "GET /earthquakes/recent": "Get recent earthquakes",
            "GET /earthquakes/magnitude": "Filter by magnitude",
            "GET /earthquakes/location": "Filter by location",
            "GET /statistics": "Get statistics",
            "POST /scrape": "Scrape new data from USGS",
            "GET /health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/scrape")
async def scrape_earthquakes(request: ScrapeRequest):
    """
    Scrape earthquake data from USGS and save to database.

    Args:
        time_range: One of 'hour', 'day', 'week', 'month'
    """
    try:
        scraper = EarthquakeScraper()
        success = scraper.fetch_data(time_range=request.time_range)

        if not success:
            raise HTTPException(status_code=500, detail="Failed to fetch earthquake data")

        earthquakes = scraper.get_all_data()
        saved_count = db.save_earthquakes(earthquakes, request.time_range)
        metadata = scraper.get_metadata()

        return {
            "success": True,
            "time_range": request.time_range,
            "records_scraped": len(earthquakes),
            "records_saved": saved_count,
            "metadata": metadata
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during scraping: {str(e)}")


@app.get("/earthquakes")
async def get_earthquakes(
    limit: Optional[int] = Query(None, description="Limit number of results")
):
    """Get all earthquakes from database."""
    try:
        earthquakes = db.get_all_earthquakes(limit=limit)
        return {
            "count": len(earthquakes),
            "data": earthquakes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving earthquakes: {str(e)}")


@app.get("/earthquakes/recent")
async def get_recent_earthquakes(
    hours: int = Query(24, description="Number of hours to look back")
):
    """Get earthquakes from the last N hours."""
    try:
        earthquakes = db.get_recent_earthquakes(hours=hours)
        return {
            "count": len(earthquakes),
            "hours": hours,
            "data": earthquakes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving recent earthquakes: {str(e)}")


@app.get("/earthquakes/magnitude")
async def get_earthquakes_by_magnitude(
    min_magnitude: float = Query(..., description="Minimum magnitude"),
    max_magnitude: Optional[float] = Query(None, description="Maximum magnitude")
):
    """Get earthquakes filtered by magnitude range."""
    try:
        earthquakes = db.get_earthquakes_by_magnitude(min_magnitude, max_magnitude)
        return {
            "count": len(earthquakes),
            "min_magnitude": min_magnitude,
            "max_magnitude": max_magnitude,
            "data": earthquakes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering by magnitude: {str(e)}")


@app.get("/earthquakes/location")
async def get_earthquakes_by_location(
    location: str = Query(..., description="Location search string")
):
    """Get earthquakes filtered by location."""
    try:
        earthquakes = db.get_earthquakes_by_location(location)
        return {
            "count": len(earthquakes),
            "location": location,
            "data": earthquakes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering by location: {str(e)}")


@app.get("/statistics", response_model=StatisticsResponse)
async def get_statistics():
    """Get earthquake statistics from database."""
    try:
        stats = db.get_statistics()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving statistics: {str(e)}")


@app.delete("/earthquakes/old")
async def clear_old_data(
    days: int = Query(30, description="Delete data older than this many days")
):
    """Clear old earthquake data from database."""
    try:
        deleted = db.clear_old_data(days=days)
        return {
            "success": True,
            "deleted_count": deleted,
            "days": days
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing old data: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    os.makedirs("../data", exist_ok=True)

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
