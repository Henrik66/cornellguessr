"use client";

import { useEffect, useRef, useState } from "react";

const CAMPUS_BOUNDS: [[number, number], [number, number]] = [
  [42.430, -76.508],
  [42.462, -76.462],
];
const CAMPUS_CENTER: [number, number] = [42.447, -76.484];

interface Guess {
  lat: number;
  lng: number;
}

interface RevealLine {
  guess: Guess;
  actual: Guess;
}

interface Props {
  onGuess: (guess: Guess) => void;
  reveal?: RevealLine | null;
  disabled?: boolean;
}

export default function GuessMap({ onGuess, reveal, disabled }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const guessMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const revealLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [pinPlaced, setPinPlaced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapRef.current, {
        center: CAMPUS_CENTER,
        zoom: 15,
        maxBounds: CAMPUS_BOUNDS,
        maxBoundsViscosity: 1.0,
        minZoom: 14,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      map.setMaxBounds(CAMPUS_BOUNDS);
      mapInstanceRef.current = map;
      revealLayerRef.current = L.layerGroup().addTo(map);

      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        if (disabled) return;
        const { lat, lng } = e.latlng;

        if (guessMarkerRef.current) {
          guessMarkerRef.current.setLatLng([lat, lng]);
        } else {
          guessMarkerRef.current = L.marker([lat, lng], {
            icon: L.divIcon({
              className: "",
              html: '<div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          }).addTo(map);
        }
        setPinPlaced(true);
        onGuess({ lat, lng });
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle disabled state
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (disabled) {
      map.off("click");
    }
  }, [disabled]);

  // Show reveal lines
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const layer = revealLayerRef.current;
    if (!L || !map || !layer || !reveal) return;

    layer.clearLayers();

    const guessIcon = L.divIcon({
      className: "",
      html: '<div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    const actualIcon = L.divIcon({
      className: "",
      html: '<div class="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    L.marker([reveal.guess.lat, reveal.guess.lng], { icon: guessIcon }).addTo(layer);
    L.marker([reveal.actual.lat, reveal.actual.lng], { icon: actualIcon }).addTo(layer);
    L.polyline(
      [
        [reveal.guess.lat, reveal.guess.lng],
        [reveal.actual.lat, reveal.actual.lng],
      ],
      { color: "#ef4444", weight: 2, dashArray: "6 4" }
    ).addTo(layer);

    map.fitBounds(
      [
        [reveal.guess.lat, reveal.guess.lng],
        [reveal.actual.lat, reveal.actual.lng],
      ],
      { padding: [40, 40] }
    );
  }, [reveal]);

  // Reset pin when reveal clears
  useEffect(() => {
    if (!reveal && guessMarkerRef.current && mapInstanceRef.current) {
      guessMarkerRef.current.remove();
      guessMarkerRef.current = null;
      setPinPlaced(false);
      mapInstanceRef.current.setView(CAMPUS_CENTER, 15);
    }
  }, [reveal]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!pinPlaced && !disabled && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-[1000]">
          Click to place your guess
        </div>
      )}
    </div>
  );
}
