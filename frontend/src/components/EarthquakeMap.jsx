import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { formatTimestamp, formatMagnitude, formatDepth, getMagnitudeColor } from '../utils/formatters';
import 'leaflet/dist/leaflet.css';

function MapBounds({ earthquakes }) {
  const map = useMap();

  useEffect(() => {
    if (earthquakes.length > 0) {
      const bounds = earthquakes
        .filter(eq => eq.latitude && eq.longitude)
        .map(eq => [eq.latitude, eq.longitude]);

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [earthquakes, map]);

  return null;
}

export default function EarthquakeMap({ earthquakes }) {
  const mapRef = useRef();

  const getMarkerSize = (magnitude) => {
    if (!magnitude) return 5;
    return Math.max(5, magnitude * 3);
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds earthquakes={earthquakes} />

        {earthquakes.map((earthquake) => {
          if (!earthquake.latitude || !earthquake.longitude) return null;

          return (
            <CircleMarker
              key={earthquake.id}
              center={[earthquake.latitude, earthquake.longitude]}
              radius={getMarkerSize(earthquake.magnitude)}
              fillColor={getMagnitudeColor(earthquake.magnitude)}
              color="#fff"
              weight={1}
              opacity={0.9}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg mb-2">{earthquake.title}</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Magnitude:</span>{' '}
                      <span
                        className="font-bold"
                        style={{ color: getMagnitudeColor(earthquake.magnitude) }}
                      >
                        {formatMagnitude(earthquake.magnitude)}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {earthquake.location}
                    </p>
                    <p>
                      <span className="font-semibold">Depth:</span> {formatDepth(earthquake.depth)}
                    </p>
                    <p>
                      <span className="font-semibold">Time:</span> {formatTimestamp(earthquake.time)}
                    </p>
                    {earthquake.tsunami === 1 && (
                      <p className="text-red-600 font-bold">⚠️ Tsunami Warning</p>
                    )}
                    {earthquake.alert && (
                      <p>
                        <span className="font-semibold">Alert:</span>{' '}
                        <span className="uppercase font-bold">{earthquake.alert}</span>
                      </p>
                    )}
                  </div>
                  {earthquake.url && (
                    <a
                      href={earthquake.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-2 block"
                    >
                      More details →
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
