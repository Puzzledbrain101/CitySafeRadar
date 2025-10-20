import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { SafetyRegion, Route } from '@shared/schema';
import { Shield, AlertTriangle, Eye } from 'lucide-react';

interface MapViewProps {
  regions: SafetyRegion[];
  selectedRoute?: Route | null;
  onRegionClick?: (region: SafetyRegion) => void;
}

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle route display
function RouteOverlay({ route }: { route: Route }) {
  const map = useMap();
  
  useEffect(() => {
    if (route) {
      const waypoints = JSON.parse(route.waypoints) as [number, number][];
      if (waypoints.length > 0) {
        const bounds = L.latLngBounds(waypoints);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [route, map]);
  
  return null;
}

export default function MapView({ regions, selectedRoute, onRegionClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  
  // Mumbai center coordinates
  const mumbaiCenter: [number, number] = [19.0760, 72.8777];
  
  // Get safety score color and glow
  const getSafetyColor = (score: number): string => {
    if (score >= 70) return '#22c55e'; // Safe green
    if (score >= 40) return '#eab308'; // Moderate yellow
    return '#ef4444'; // Unsafe red
  };
  
  const getSafetyGlow = (score: number): string => {
    if (score >= 70) return 'shadow-glow-green';
    if (score >= 40) return 'shadow-glow-orange';
    return 'shadow-glow-red';
  };
  
  const getSafetyLabel = (score: number): string => {
    if (score >= 70) return 'Safe';
    if (score >= 40) return 'Moderate';
    return 'Unsafe';
  };
  
  // Parse route waypoints for display
  const routeWaypoints = selectedRoute 
    ? (JSON.parse(selectedRoute.waypoints) as [number, number][])
    : [];
  
  return (
    <div className="relative w-full h-full">
      {/* Radar scan animation overlay */}
      <div className="absolute inset-0 pointer-events-none z-[400] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2">
          <div 
            className="w-full h-full animate-radar-scan opacity-10"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(6, 182, 212, 0.3) 10%, transparent 20%)',
            }}
          />
        </div>
      </div>
      
      <MapContainer
        center={mumbaiCenter}
        zoom={12}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Safety regions as circles */}
        {regions.map((region) => (
          <Circle
            key={region.id}
            center={[region.latitude, region.longitude]}
            radius={800}
            pathOptions={{
              fillColor: getSafetyColor(region.safetyScore),
              fillOpacity: 0.4,
              color: getSafetyColor(region.safetyScore),
              weight: 2,
              opacity: 0.8,
            }}
            eventHandlers={{
              click: () => onRegionClick?.(region),
            }}
            data-testid={`region-${region.id}`}
          >
            <Popup>
              <div className="p-2 bg-gray-900 text-white rounded-lg min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base">{region.name}</h3>
                  <span 
                    className="px-2 py-1 rounded text-xs font-mono font-semibold"
                    style={{ 
                      backgroundColor: getSafetyColor(region.safetyScore),
                      color: '#000'
                    }}
                  >
                    {region.safetyScore}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Status
                    </span>
                    <span className="font-medium">{getSafetyLabel(region.safetyScore)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Lighting
                    </span>
                    <span className="font-medium">{region.lighting}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Crowd Density</span>
                    <span className="font-medium">{region.crowdDensity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Incidents (24h)
                    </span>
                    <span className="font-medium">{region.incidents24h}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
        
        {/* Route polyline */}
        {selectedRoute && routeWaypoints.length > 0 && (
          <>
            <Polyline
              positions={routeWaypoints}
              pathOptions={{
                color: '#06b6d4',
                weight: 4,
                opacity: 0.8,
              }}
            />
            <RouteOverlay route={selectedRoute} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
