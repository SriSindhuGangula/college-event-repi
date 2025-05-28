import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationMarker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      // Reverse geocode using OpenStreetMap's Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const locationName = data.display_name || "Unnamed location";

      onSelect({ lat, lng, locationName });
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ onLocationSelect }) => {
  return (
    <MapContainer center={[17.4917, 78.3910]} zoom={15} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default LocationPicker;
