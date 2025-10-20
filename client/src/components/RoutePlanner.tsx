import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Route } from '@shared/schema';

interface RoutePlannerProps {
  onRouteCalculated?: (route: Route) => void;
  className?: string;
}

export default function RoutePlanner({ onRouteCalculated, className = '' }: RoutePlannerProps) {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const { toast } = useToast();
  
  const calculateRouteMutation = useMutation({
    mutationFn: async (data: { source: string; destination: string }) => {
      const response = await apiRequest('POST', '/api/route', data);
      return await response.json() as Route;
    },
    onSuccess: (route) => {
      queryClient.invalidateQueries({ queryKey: ['/api/routes'] });
      onRouteCalculated?.(route);
      toast({
        title: 'Route Calculated',
        description: `Safest route found with average safety score of ${route.averageSafetyScore}`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to calculate route',
        variant: 'destructive',
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter both source and destination',
        variant: 'destructive',
      });
      return;
    }
    calculateRouteMutation.mutate({ source: source.trim(), destination: destination.trim() });
  };
  
  const currentRoute = calculateRouteMutation.data;
  
  return (
    <Card 
      className={`bg-gray-900/90 backdrop-blur-lg border-gray-700/50 shadow-lg shadow-cyan-500/10 ${className}`}
      data-testid="card-route-planner"
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
          <Navigation className="w-5 h-5 text-cyan-500" />
          Safest Route Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium text-gray-300">
              Source Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g., Andheri Station"
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
                data-testid="input-route-source"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium text-gray-300">
              Destination Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Bandra West"
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
                data-testid="input-route-destination"
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-medium shadow-glow-cyan"
            disabled={calculateRouteMutation.isPending}
            data-testid="button-calculate-route"
          >
            {calculateRouteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 mr-2" />
                Calculate Safest Route
              </>
            )}
          </Button>
        </form>
        
        {currentRoute && (
          <div className="pt-4 border-t border-gray-700/50 space-y-3" data-testid="route-details">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Route Details
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/60 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  Safety Score
                </div>
                <div className="text-2xl font-mono font-bold text-cyan-400" data-testid="text-route-safety-score">
                  {currentRoute.averageSafetyScore}
                </div>
              </div>
              
              <div className="bg-gray-800/60 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  Est. Time
                </div>
                <div className="text-2xl font-mono font-bold text-white" data-testid="text-route-time">
                  {currentRoute.estimatedTime}
                  <span className="text-sm font-normal text-gray-400 ml-1">min</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Distance</div>
              <div className="text-lg font-mono font-semibold text-white" data-testid="text-route-distance">
                {currentRoute.distance?.toFixed(2) || '0.00'} km
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
