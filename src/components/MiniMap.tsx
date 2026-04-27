import { Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { MapPin } from 'lucide-react';

interface MiniMapProps {
  onGuess: (lat: number, lng: number) => void;
  isGuessed: boolean;
  actualLocation?: { lat: number; lng: number };
}

export default function MiniMap({ onGuess, isGuessed, actualLocation }: MiniMapProps) {
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // When actual location changes or round advances, we need to clear marker.
  // We'll manage markerPos from outside if we want, or reset it.
  // Actually, we should just let App pass a `markerPos` state to MiniMap, or manage it here and reset via a `reset` prop/key.

  return null;
}
