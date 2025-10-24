import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-react';
import type { Alert } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
  },
  info: {
    icon: Info,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500',
  },
};

export default function AlertsPanel() {
  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });
  
  const sortedAlerts = alerts?.sort((a, b) => {
    // Sort by severity first (critical > warning > info), then by timestamp
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - 
                        severityOrder[b.severity as keyof typeof severityOrder];
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  }) || [];
  
  return (
    <Card 
      className="bg-gray-900/90 backdrop-blur-lg border-gray-700/50 h-full flex flex-col"
      data-testid="card-alerts-panel"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Live Alerts
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Info className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No active alerts</p>
            <p className="text-gray-500 text-xs mt-1">All areas are currently safe</p>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {sortedAlerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig];
                const Icon = config.icon;
                
                return (
                  <div
                    key={alert.id}
                    className={`${config.bg} border-l-4 ${config.border} p-4 rounded-lg transition-colors duration-500`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white leading-relaxed">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
