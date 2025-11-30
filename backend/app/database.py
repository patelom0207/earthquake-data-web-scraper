import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional


class EarthquakeDatabase:
    """SQLite database for storing and managing earthquake data."""

    def __init__(self, db_path: str = "data/earthquakes.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database tables."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS earthquakes (
                id TEXT PRIMARY KEY,
                title TEXT,
                magnitude REAL,
                location TEXT,
                time INTEGER,
                updated INTEGER,
                timezone INTEGER,
                url TEXT,
                detail TEXT,
                felt INTEGER,
                cdi REAL,
                mmi REAL,
                alert TEXT,
                status TEXT,
                tsunami INTEGER,
                sig INTEGER,
                net TEXT,
                code TEXT,
                ids TEXT,
                sources TEXT,
                types TEXT,
                nst INTEGER,
                dmin REAL,
                rms REAL,
                gap REAL,
                magType TEXT,
                type TEXT,
                longitude REAL,
                latitude REAL,
                depth REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scrape_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                time_range TEXT,
                record_count INTEGER,
                scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

    def save_earthquakes(self, earthquakes: List[Dict], time_range: str) -> int:
        """
        Save earthquake data to database.

        Args:
            earthquakes: List of earthquake dictionaries
            time_range: Time range of the data scrape

        Returns:
            Number of records saved
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        saved_count = 0
        for eq in earthquakes:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO earthquakes (
                        id, title, magnitude, location, time, updated, timezone,
                        url, detail, felt, cdi, mmi, alert, status, tsunami, sig,
                        net, code, ids, sources, types, nst, dmin, rms, gap,
                        magType, type, longitude, latitude, depth
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    eq['id'], eq['title'], eq['magnitude'], eq['location'],
                    eq['time'], eq['updated'], eq['timezone'], eq['url'],
                    eq['detail'], eq['felt'], eq['cdi'], eq['mmi'], eq['alert'],
                    eq['status'], eq['tsunami'], eq['sig'], eq['net'], eq['code'],
                    eq['ids'], eq['sources'], eq['types'], eq['nst'], eq['dmin'],
                    eq['rms'], eq['gap'], eq['magType'], eq['type'],
                    eq['longitude'], eq['latitude'], eq['depth']
                ))
                saved_count += 1
            except Exception as e:
                print(f"Error saving earthquake {eq.get('id')}: {e}")

        cursor.execute('''
            INSERT INTO scrape_history (time_range, record_count)
            VALUES (?, ?)
        ''', (time_range, saved_count))

        conn.commit()
        conn.close()

        return saved_count

    def get_all_earthquakes(self, limit: Optional[int] = None) -> List[Dict]:
        """Get all earthquakes from database."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        query = 'SELECT * FROM earthquakes ORDER BY time DESC'
        if limit:
            query += f' LIMIT {limit}'

        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_earthquakes_by_magnitude(self, min_mag: float, max_mag: Optional[float] = None) -> List[Dict]:
        """Get earthquakes filtered by magnitude range."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        if max_mag:
            cursor.execute('''
                SELECT * FROM earthquakes
                WHERE magnitude >= ? AND magnitude <= ?
                ORDER BY time DESC
            ''', (min_mag, max_mag))
        else:
            cursor.execute('''
                SELECT * FROM earthquakes
                WHERE magnitude >= ?
                ORDER BY time DESC
            ''', (min_mag,))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_earthquakes_by_location(self, location: str) -> List[Dict]:
        """Get earthquakes filtered by location."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute('''
            SELECT * FROM earthquakes
            WHERE location LIKE ?
            ORDER BY time DESC
        ''', (f'%{location}%',))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_recent_earthquakes(self, hours: int = 24) -> List[Dict]:
        """Get earthquakes from the last N hours."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        time_threshold = int((datetime.now().timestamp() - (hours * 3600)) * 1000)

        cursor.execute('''
            SELECT * FROM earthquakes
            WHERE time >= ?
            ORDER BY time DESC
        ''', (time_threshold,))

        rows = cursor.fetchall()
        conn.close()

        return [dict(row) for row in rows]

    def get_statistics(self) -> Dict:
        """Get database statistics."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) as total FROM earthquakes')
        total = cursor.fetchone()[0]

        cursor.execute('SELECT MIN(magnitude), MAX(magnitude), AVG(magnitude) FROM earthquakes WHERE magnitude IS NOT NULL')
        mag_stats = cursor.fetchone()

        cursor.execute('SELECT COUNT(*) FROM earthquakes WHERE tsunami = 1')
        tsunami_count = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(DISTINCT location) FROM earthquakes')
        unique_locations = cursor.fetchone()[0]

        conn.close()

        return {
            'total_earthquakes': total,
            'magnitude_min': mag_stats[0],
            'magnitude_max': mag_stats[1],
            'magnitude_avg': mag_stats[2],
            'tsunami_events': tsunami_count,
            'unique_locations': unique_locations
        }

    def clear_old_data(self, days: int = 30):
        """Clear earthquake data older than specified days."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        time_threshold = int((datetime.now().timestamp() - (days * 24 * 3600)) * 1000)

        cursor.execute('DELETE FROM earthquakes WHERE time < ?', (time_threshold,))
        deleted = cursor.rowcount

        conn.commit()
        conn.close()

        return deleted

    def clear_all_data(self):
        """Clear all earthquake data from database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('DELETE FROM earthquakes')
        deleted = cursor.rowcount

        conn.commit()
        conn.close()

        return deleted
