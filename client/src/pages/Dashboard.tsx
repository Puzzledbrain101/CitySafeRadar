import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MapView from '@/components/MapView';
import RoutePlanner from '@/components/RoutePlanner';
import AlertsPanel from '@/components/AlertsPanel';
import UserReportForm from '@/components/UserReportForm';
import SafetyLegend from '@/components/SafetyLegend';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Radar } from 'lucide-react';
import type { SafetyRegion, Route } from '@shared/schema';

export default function Dashboard() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  
  // Fetch heatmap data with auto-refresh every 5 seconds
  const { data: heatmapData, isLoading } = useQuery<{ regions: SafetyRegion[] }>({
    queryKey: ['/api/heatmap'],
    refetchInterval: 5000,
  });
  
  const regions = heatmapData?.regions || [];
  
  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Navigation Bar */}
      <header 
        className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/30 px-4 md:px-6 flex items-center justify-between z-[500] flex-shrink-0"
        data-testid="navigation-header"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radar className="w-8 h-8 text-cyan-500" />
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              City Safety Radar
            </h1>
            <p className="text-xs text-gray-400">Mumbai</p>
          </div>
        </div>
        
        {/* Safety Legend */}
        <div className="hidden md:flex">
          <SafetyLegend />
        </div>
        
        {/* Report Button */}
        <Button 
          onClick={() => setIsReportFormOpen(true)}
          className="bg-orange-500 hover:bg-orange-400 text-white font-medium shadow-glow-orange"
          data-testid="button-open-report-form"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Report Incident
        </Button>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map View - 70% on desktop, 100% on mobile */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <Radar className="w-16 h-16 text-cyan-500 animate-pulse mx-auto mb-4" />
                <p className="text-gray-400">Loading safety data...</p>
              </div>
            </div>
          ) : (
            <MapView 
              regions={regions} 
              selectedRoute={selectedRoute}
            />
          )}
          
          {/* Floating Route Planner - bottom-left on desktop */}
          <div className="absolute bottom-6 left-6 w-full max-w-sm hidden lg:block">
            <RoutePlanner 
              onRouteCalculated={setSelectedRoute}
            />
          </div>
        </div>
        
        {/* Right Sidebar - 30% on desktop, hidden on mobile */}
        <aside className="hidden lg:flex lg:w-[30%] xl:w-[25%] border-l border-gray-700/50 bg-gray-950/50 backdrop-blur">
          <div className="w-full p-6 space-y-6">
            {/* Alerts Panel */}
            <div className="h-[calc(100vh-8rem)]">
              <AlertsPanel />
            </div>
          </div>
        </aside>
      </div>
      
      {/* Mobile Route Planner - bottom sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-[500]">
        <RoutePlanner 
          onRouteCalculated={setSelectedRoute}
        />
      </div>
      
      {/* Mobile Alerts - can be toggled later */}
      {/* You can add a floating button to show alerts on mobile */}
      
      {/* User Report Form Modal */}
      <UserReportForm 
        open={isReportFormOpen}
        onOpenChange={setIsReportFormOpen}
      />
      
      {/* Privacy Banner */}
      <PrivacyBanner />
    </div>
  );
}
