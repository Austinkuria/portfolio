'use client';

import { useState, useEffect, useCallback, memo } from 'react';

const LoadingIndicator = memo(function LoadingIndicator() {
  // Only show the indicator after a short delay to prevent flashing for fast navigations
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Initializing...');
  const [timeExpired, setTimeExpired] = useState(false);
  
  useEffect(() => {
    // Show the loading indicator only if navigation takes more than 200ms
    const timeoutId = setTimeout(() => {
      setVisible(true);
    }, 200);
    
    // Set a maximum time for the loading indicator
    const maxTimeoutId = setTimeout(() => {
      setTimeExpired(true);
    }, 8000); // Maximum 8 seconds before force completing
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(maxTimeoutId);
    };
  }, []);

  // Optimize progress calculation with useCallback
  const updateProgress = useCallback(() => {
    setProgress(prev => {
      // Increase speed of progression especially in the later stages
      const increment = prev < 30 ? 12 : prev < 70 ? 8 : prev < 90 ? 5 : 4;
      const newProgress = Math.min(prev + increment, 100); // Allow reaching 100%
      
      // Update message based on progress
      if (newProgress < 30) setCurrentMessage('Initializing...');
      else if (newProgress < 70) setCurrentMessage('Loading content...');
      else if (newProgress < 90) setCurrentMessage('Almost ready...');
      else setCurrentMessage('Finishing up...');
      
      return newProgress;
    });
  }, []);

  // Simulate progress for better UX with optimized interval
  useEffect(() => {
    if (!visible) return;
    
    // Faster interval for smoother animation
    const progressInterval = setInterval(updateProgress, 100);
    
    return () => clearInterval(progressInterval);
  }, [visible, updateProgress]);
  
  // Force complete loading if time expired
  useEffect(() => {
    if (timeExpired) {
      setProgress(100);
      
      // Force completion after a brief delay
      const forceCompleteTimeout = setTimeout(() => {
        // Dispatch a synthetic event to inform the app that navigation is complete
        const customEvent = new Event('navigationComplete', { bubbles: true });
        document.dispatchEvent(customEvent);
      }, 500);
      
      return () => clearTimeout(forceCompleteTimeout);
    }
  }, [timeExpired]);
  
  // Don't render anything if we're still within the delay period or if we've hit 100%
  if (!visible || progress >= 100) return null;
  
  return (
    <>
      {/* Top progress bar - simplified animation */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/50">
        <div 
          className="h-full bg-primary"
          style={{ 
            width: `${progress}%`,
            transition: 'width 100ms ease-out'
          }}
        />
      </div>

      {/* Simplified loading card - reduced animations */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-background/95 backdrop-blur-sm shadow-xl px-6 py-4 rounded-xl flex items-center gap-4 border border-border/50">
          {/* Simplified spinner with fewer animations */}
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary/20 border-t-primary"></div>

          {/* Loading text with simpler animation */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground/90">
              Loading
              <span className="loading-dot-1">.</span>
              <span className="loading-dot-2">.</span>
              <span className="loading-dot-3">.</span>
            </span>
            <div className="text-xs text-muted-foreground mt-0.5">
              {currentMessage}
            </div>
          </div>

          {/* Progress percentage */}
          <div className="text-xs font-mono text-muted-foreground min-w-[3ch]">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
