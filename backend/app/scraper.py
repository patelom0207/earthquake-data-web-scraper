import urllib.request
import json
from datetime import datetime
from typing import List, Dict, Optional


class EarthquakeScraper:
    """
    Enhanced earthquake data scraper with support for multiple time ranges
    and additional filtering capabilities.
    """

    BASE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary"

    TIME_RANGES = {
        'hour': 'all_hour.geojson',
        'day': 'all_day.geojson',
        'week': 'all_week.geojson',
        'month': 'all_month.geojson'
    }

    def __init__(self):
        self.data = None
        self.raw_json = None

    def fetch_data(self, time_range: str = 'day') -> bool:
        """
        Fetch earthquake data from USGS API.

        Args:
            time_range: One of 'hour', 'day', 'week', 'month'

        Returns:
            bool: True if successful, False otherwise
        """
        if time_range not in self.TIME_RANGES:
            raise ValueError(f"Invalid time range. Must be one of {list(self.TIME_RANGES.keys())}")

        api_url = f"{self.BASE_URL}/{self.TIME_RANGES[time_range]}"

        try:
            response = urllib.request.urlopen(api_url)
            status_code = response.getcode()

            if status_code == 200:
                data = response.read()
                self.raw_json = json.loads(data.decode("utf-8"))
                self.data = self._parse_data()
                return True
            else:
                print(f"Error: Non-valid status code: {status_code}")
                return False
        except Exception as e:
            print(f"Error fetching data: {e}")
            return False

    def _parse_data(self) -> List[Dict]:
        """Parse raw JSON data into structured earthquake records."""
        if not self.raw_json:
            return []

        earthquakes = []
        for feature in self.raw_json['features']:
            properties = feature['properties']
            geometry = feature['geometry']

            earthquake = {
                'id': feature['id'],
                'title': properties.get('title'),
                'magnitude': properties.get('mag'),
                'location': properties.get('place'),
                'time': properties.get('time'),
                'updated': properties.get('updated'),
                'timezone': properties.get('tz'),
                'url': properties.get('url'),
                'detail': properties.get('detail'),
                'felt': properties.get('felt'),
                'cdi': properties.get('cdi'),
                'mmi': properties.get('mmi'),
                'alert': properties.get('alert'),
                'status': properties.get('status'),
                'tsunami': properties.get('tsunami'),
                'sig': properties.get('sig'),
                'net': properties.get('net'),
                'code': properties.get('code'),
                'ids': properties.get('ids'),
                'sources': properties.get('sources'),
                'types': properties.get('types'),
                'nst': properties.get('nst'),
                'dmin': properties.get('dmin'),
                'rms': properties.get('rms'),
                'gap': properties.get('gap'),
                'magType': properties.get('magType'),
                'type': properties.get('type'),
                'longitude': geometry['coordinates'][0] if geometry else None,
                'latitude': geometry['coordinates'][1] if geometry else None,
                'depth': geometry['coordinates'][2] if geometry else None
            }
            earthquakes.append(earthquake)

        return earthquakes

    def filter_by_magnitude(self, min_magnitude: float, max_magnitude: Optional[float] = None) -> List[Dict]:
        """Filter earthquakes by magnitude range."""
        if not self.data:
            return []

        filtered = []
        for earthquake in self.data:
            mag = earthquake['magnitude']
            if mag is None:
                continue

            if max_magnitude:
                if min_magnitude <= mag <= max_magnitude:
                    filtered.append(earthquake)
            else:
                if mag >= min_magnitude:
                    filtered.append(earthquake)

        return filtered

    def filter_by_location(self, location_query: str) -> List[Dict]:
        """Filter earthquakes by location string match."""
        if not self.data:
            return []

        filtered = []
        for earthquake in self.data:
            location = earthquake['location']
            if location and location_query.lower() in location.lower():
                filtered.append(earthquake)

        return filtered

    def filter_by_field(self, field: str, value) -> List[Dict]:
        """Filter earthquakes by any field value."""
        if not self.data:
            return []

        filtered = []
        for earthquake in self.data:
            if field in earthquake and earthquake[field] == value:
                filtered.append(earthquake)

        return filtered

    def get_all_data(self) -> List[Dict]:
        """Get all earthquake data."""
        return self.data if self.data else []

    def get_metadata(self) -> Dict:
        """Get metadata about the earthquake dataset."""
        if not self.raw_json:
            return {}

        metadata = self.raw_json.get('metadata', {})
        return {
            'generated': metadata.get('generated'),
            'url': metadata.get('url'),
            'title': metadata.get('title'),
            'status': metadata.get('status'),
            'api': metadata.get('api'),
            'count': metadata.get('count')
        }

    def get_statistics(self) -> Dict:
        """Calculate statistics about the earthquake data."""
        if not self.data:
            return {}

        magnitudes = [eq['magnitude'] for eq in self.data if eq['magnitude'] is not None]
        depths = [eq['depth'] for eq in self.data if eq['depth'] is not None]

        stats = {
            'total_count': len(self.data),
            'magnitude_stats': {
                'min': min(magnitudes) if magnitudes else None,
                'max': max(magnitudes) if magnitudes else None,
                'avg': sum(magnitudes) / len(magnitudes) if magnitudes else None
            },
            'depth_stats': {
                'min': min(depths) if depths else None,
                'max': max(depths) if depths else None,
                'avg': sum(depths) / len(depths) if depths else None
            },
            'tsunami_count': sum(1 for eq in self.data if eq.get('tsunami') == 1),
            'felt_count': sum(1 for eq in self.data if eq.get('felt') is not None)
        }

        return stats
