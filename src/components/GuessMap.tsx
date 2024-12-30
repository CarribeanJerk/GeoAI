import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapMouseEvent } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set token globally before component renders
if (process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
}

interface GuessMapProps {
  onGuessSubmit: (coords: [number, number]) => void;
}

export default function GuessMap({ onGuessSubmit }: GuessMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [guessCoords, setGuessCoords] = useState<[number, number] | null>(null);
  const [, setHoverCoords] = useState<[number, number] | null>(null);
  const hoverMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token not found');
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [0, 20],
      zoom: 1.5,
      maxZoom: 12,
      minZoom: 1
    });

    map.on('load', () => {
      console.log('Map loaded successfully');
      map.resize();
    });

    map.on('mousemove', (e: MapMouseEvent) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setHoverCoords(coords);
      
      if (hoverMarker.current) {
        hoverMarker.current.setLngLat(coords);
      } else {
        // Create semi-transparent hover marker
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full bg-blue-500/50 border-2 border-white/50 transform -translate-x-1/2 -translate-y-1/2';
        hoverMarker.current = new mapboxgl.Marker({element: el})
          .setLngLat(coords)
          .addTo(map);
      }
    });

    map.on('click', (e: MapMouseEvent) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setGuessCoords(coords);
      
      if (marker.current) {
        marker.current.remove();
      }
      
      // Create solid placed marker
      const el = document.createElement('div');
      el.className = 'w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2';
      marker.current = new mapboxgl.Marker({element: el})
        .setLngLat(coords)
        .addTo(map);
    });

    map.on('error', (e) => {
      console.error('Mapbox error:', e);
    });

    return () => {
      map.remove();
      if (marker.current) marker.current.remove();
      if (hoverMarker.current) hoverMarker.current.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full [&_.mapboxgl-ctrl-logo]:hidden [&_.mapboxgl-ctrl-bottom-right]:hidden" />
      {guessCoords && (
        <button
          onClick={() => onGuessSubmit(guessCoords)}
          className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 
            text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          Submit Guess
        </button>
      )}
    </div>
  );
} 