import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Map, AdvancedMarker, useMap, MapMouseEvent, useMapsLibrary } from '@vis.gl/react-google-maps';

export function GuessMap({ 
  onGuess, 
  markerPos, 
  setMarkerPos,
  actualLocation,
  isResultPhase
}: { 
  onGuess: () => void;
  markerPos: google.maps.LatLngLiteral | null;
  setMarkerPos: (pos: google.maps.LatLngLiteral | null) => void;
  actualLocation?: google.maps.LatLngLiteral;
  isResultPhase: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMapClick = (e: MapMouseEvent) => {
    if (isResultPhase || !e.detail.latLng) return;
    setMarkerPos(e.detail.latLng);
  };

  return (
    <div 
      className={`absolute bottom-6 right-6 z-10 transition-all duration-300 ease-in-out origin-bottom-right rounded-2xl overflow-hidden shadow-2xl border-2 border-zinc-800 bg-zinc-950 ${
        isExpanded || isResultPhase ? 'w-[400px] h-[300px]' : 'w-[280px] h-[200px] cursor-pointer hover:w-[300px] hover:h-[220px]'
      }`}
      onMouseEnter={() => !isResultPhase && setIsExpanded(true)}
      onMouseLeave={() => !isResultPhase && setIsExpanded(false)}
    >
      <div className="w-full h-full relative" style={{ backgroundColor: '#18181b' }}>
        <Map
          mapId="GUESS_MAP_ID"
          defaultCenter={{ lat: 20, lng: 0 }}
          defaultZoom={isResultPhase ? 2 : 1}
          gestureHandling={isResultPhase ? "greedy" : "auto"}
          disableDefaultUI={true}
          onClick={handleMapClick}
        >
          {markerPos && <AdvancedMarker position={markerPos} />}
          {isResultPhase && actualLocation && (
             <AdvancedMarker position={actualLocation}>
               <div style={{ transform: 'translateY(-100%)' }}>
                 <MapPin className="text-rose-500 fill-rose-500 w-10 h-10 drop-shadow-md" />
               </div>
             </AdvancedMarker>
          )}
          {isResultPhase && markerPos && actualLocation && (
            <ResultPolyline from={markerPos} to={actualLocation} />
          )}
        </Map>
      </div>

      {!isResultPhase && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={(e) => { e.stopPropagation(); onGuess(); }}
            disabled={!markerPos}
            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg transition-colors"
          >
            GUESS
          </button>
        </div>
      )}
    </div>
  );
}

function ResultPolyline({ from, to }: { from: google.maps.LatLngLiteral, to: google.maps.LatLngLiteral }) {
  const map = useMap();
  const mapsLibrary = useMapsLibrary('maps');
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !window.google) return;

    if (!polylineRef.current) {
      polylineRef.current = new window.google.maps.Polyline({
        path: [from, to],
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map
      });
    } else {
      polylineRef.current.setPath([from, to]);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, from, to]);

  // Adjust bounds to fit both points
  useEffect(() => {
    if (!map || !window.google) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(from);
    bounds.extend(to);
    
    // Animate map fitBounds
    map.fitBounds(bounds, 50);
  }, [map, from, to]);

  return null;
}
