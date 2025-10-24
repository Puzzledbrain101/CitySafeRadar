import { Shield } from 'lucide-react';

export default function SafetyLegend() {
  return (
    <div className="flex items-center gap-4" data-testid="safety-legend">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-safety-safe shadow-glow-green" />
        <span className="text-xs uppercase tracking-wider text-gray-300 font-medium">
          Safe (70+)
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-safety-moderate shadow-glow-orange" />
        <span className="text-xs uppercase tracking-wider text-gray-300 font-medium">
          Moderate (40-70)
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-safety-unsafe shadow-glow-red" />
        <span className="text-xs uppercase tracking-wider text-gray-300 font-medium">
          Unsafe (&lt;40)
        </span>
      </div>
    </div>
  );
}
