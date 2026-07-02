'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MARKER_COLORS = ['#DC2626', '#F59E0B', '#2563EB', '#7C3AED', '#0B6E4F', '#DB2777'];

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points.map((p) => [p.lat, p.lng]), { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 10);
    }
  }, [points, map]);
  return null;
}

export default function FarmsMap({ center, points, onSelect }) {
  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      {points.map((point, idx) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={11}
          pathOptions={{
            color: '#fff',
            weight: 2,
            fillColor: MARKER_COLORS[idx % MARKER_COLORS.length],
            fillOpacity: 1,
          }}
          eventHandlers={{ click: () => onSelect && onSelect(point) }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.location}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
