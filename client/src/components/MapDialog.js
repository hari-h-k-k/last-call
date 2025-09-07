"use client";

import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MapDialog({ isOpen, onClose, onSelect }) {
  const [selected, setSelected] = useState(null);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // ✅ use env var
     googleMapsApiKey: "AIzaSyD9_viwyG6i2XAsOLDIsou40uPVuivzWWs", // ✅ working
  });

  if (!isOpen) return null;
  if (!isLoaded) return <div className="p-6">Loading map...</div>;

  const handleClick = (e) => {
    setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  const handleSubmit = () => {
    if (!selected) return alert("Please select a location on the map.");
    onSelect(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1F2937] rounded-2xl p-6 w-[90%] max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">📍 Select Location</h2>
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={selected || { lat: 37.7749, lng: -122.4194 }} // Default: San Francisco
            zoom={10}
            onClick={handleClick}
          >
            {selected && <Marker position={selected} />}
          </GoogleMap>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
