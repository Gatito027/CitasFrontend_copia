import { useEffect, useRef } from "react";
import L from "leaflet";

export default function MapaUbicacion({ ubicacion, setUbicacion }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([19.8486, -99.2096], 13); // Huehuetoca por defecto

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mapRef.current.on("click", async (e) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng).addTo(mapRef.current);
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data?.display_name) {
          setUbicacion(data.display_name);
        }
      });
    }
  }, [setUbicacion]);

  useEffect(() => {
    if (ubicacion && mapRef.current) {
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
          mapRef.current.setView(latLng, 13);

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
      id="map"
      className="w-full h-64 rounded-lg border border-sky-300 mt-4"
    />
  );
}
