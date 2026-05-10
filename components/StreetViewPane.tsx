"use client";

import { useEffect, useRef } from "react";
import type { Location } from "@/lib/database.types";

interface Props {
  location: Location;
}

declare global {
  interface Window {
    google: typeof google;
    initStreetView?: () => void;
  }
}

let googleMapsLoaded = false;
let loadPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (googleMapsLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    window.initStreetView = () => {
      googleMapsLoaded = true;
      resolve();
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&callback=initStreetView`;
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return loadPromise;
}

export default function StreetViewPane({ location }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const panoRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !ref.current) return;
      const opts: google.maps.StreetViewPanoramaOptions = {
        pov: { heading: location.heading, pitch: location.pitch },
        zoom: 1,
        disableDefaultUI: true,
        linksControl: false,
        panControl: false,
        clickToGo: false,
        enableCloseButton: false,
        scrollwheel: true,
        motionTracking: false,
        motionTrackingControl: false,
      };
      if (location.pano_id) {
        opts.pano = location.pano_id;
      } else {
        opts.position = { lat: location.lat, lng: location.lng };
      }
      panoRef.current = new google.maps.StreetViewPanorama(ref.current, opts);
    });
    return () => {
      cancelled = true;
    };
  }, [location]);

  return (
    <div
      ref={ref}
      className="w-full h-full bg-gray-900"
      aria-label={`Street View of ${location.name}`}
    />
  );
}
