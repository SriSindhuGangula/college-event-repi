import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ position, setPosition, onSelect }) => {
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const locationName = data.display_name || "Unnamed location";
        onSelect({ lat, lng, locationName });
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        onSelect({ lat, lng, locationName: "Unknown location" });
      }
    },
  });

  return position ? (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: async (e) => {
          const { lat, lng } = e.target.getLatLng();
          setPosition({ lat, lng });
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const locationName = data.display_name || "Unnamed location";
            onSelect({ lat, lng, locationName });
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            onSelect({ lat, lng, locationName: "Unknown location" });
          }
        },
      }}
    >
      <Popup>Drag to adjust location</Popup>
    </Marker>
  ) : null;
};

const LocationPicker = ({ onLocationSelect, initialCenter = [17.4917, 78.3910], zoom = 15 }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setPosition({ lat: latNum, lng: lonNum });
        onLocationSelect({ lat: latNum, lng: lonNum, locationName: display_name });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPosition(null);
    setSearchQuery('');
    onLocationSelect(null);
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>

      <MapContainer center={initialCenter} zoom={zoom} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onSelect={onLocationSelect} />
      </MapContainer>

      {position && (
        <div style={{ marginTop: '10px', padding: '5px', background: '#f5f5f5', borderRadius: '5px' }}>
          <strong>Selected Location:</strong><br />
          Lat: {position.lat.toFixed(5)}, Lng: {position.lng.toFixed(5)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
