import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const hasSeenBanner = localStorage.getItem('privacy-banner-seen');
    if (!hasSeenBanner) {
      setIsVisible(true);
    }
  }, []);
  
  const handleDismiss = () => {
    localStorage.setItem('privacy-banner-seen', 'true');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur border-t border-cyan-500/30 p-4 z-[1000] animate-in slide-in-from-bottom duration-300"
      data-testid="privacy-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 flex-1">
          <Shield className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-white font-medium mb-1">
              Privacy & Data Protection
            </p>
            <p className="text-xs text-gray-300">
              All camera feeds are anonymized and processed locally. No personal tracking or identifiable data is stored. 
              Your safety reports are confidential and help keep Mumbai safer for everyone.
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white flex-shrink-0"
          data-testid="button-dismiss-privacy"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
