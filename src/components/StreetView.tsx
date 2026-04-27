import { useEffect, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

export function StreetView({ lat, lng }: { lat: number; lng: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const streetViewLibrary = useMapsLibrary('streetView');
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!streetViewLibrary || !containerRef.current) return;

    if (!streetViewRef.current) {
      streetViewRef.current = new streetViewLibrary.StreetViewPanorama(containerRef.current, {
        position: { lat, lng },
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false,
        linksControl: true,
        panControl: true,
        enableCloseButton: false,
        fullscreenControl: false,
      });
    } else {
      streetViewRef.current.setPosition({ lat, lng });
    }
  }, [lat, lng, streetViewLibrary]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
