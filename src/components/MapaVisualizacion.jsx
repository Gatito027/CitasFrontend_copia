import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaVisualizacion({ ubicacion }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map-visual").setView([19.9136, -99.3425], 13); // Coordenadas por defecto

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    if (ubicacion) {
      (async () => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            ubicacion
          )}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          const latLng = L.latLng(lat, lon);
          mapRef.current.setView(latLng, 14);

          if (markerRef.current) {
            markerRef.current.setLatLng(latLng);
          } else {
            markerRef.current = L.marker(latLng).addTo(mapRef.current);
          }
        }
      })();
    }
  }, [ubicacion]);

  return (
    <div
      id="map-visual"
      className="w-full h-[400px] rounded-lg border border-sky-300 mt-4"
    />
  );
}
