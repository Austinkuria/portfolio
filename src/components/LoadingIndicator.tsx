'use client';

import { useState, useEffect, useCallback, memo } from 'react';

const LoadingIndicator = memo(function LoadingIndicator() {
  // Only show the indicator after a short delay to prevent flashing for fast navigations
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('Initializing...');
  
  useEffect(() => {
    // Show the loading indicator only if navigation takes more than 300ms
    const timeoutId = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Optimize progress calculation with useCallback
  const updateProgress = useCallback(() => {
    setProgress(prev => {
      // Gradually increase progress but slow down as it approaches 100%
      const increment = prev < 30 ? 8 : prev < 70 ? 4 : prev < 90 ? 2 : 0.5;
      const newProgress = Math.min(prev + increment, 95); // Cap at 95% until navigation completes
      
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
    
    const progressInterval = setInterval(updateProgress, 150);
    
    return () => clearInterval(progressInterval);
  }, [visible, updateProgress]);
  
  // Don't render anything if we're still within the delay period
  if (!visible) return null;
  
  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out progress-glow"
          style={{ 
            width: `${progress}%`,
            transition: 'width 150ms ease-out'
          }}
        />
      </div>

      {/* Enhanced loading card */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-background/95 backdrop-blur-sm shadow-xl px-6 py-4 rounded-xl flex items-center gap-4 border border-border/50 transition-all duration-500 animate-in slide-in-from-top-4 fade-in-0 loading-shimmer">
          {/* Animated spinner with multiple rings */}
          <div className="relative">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 h-5 w-5 rounded-full border-2 border-primary/10 animate-pulse"></div>
            <div className="absolute inset-1 h-3 w-3 rounded-full border border-primary/30 animate-ping"></div>
          </div>

          {/* Loading text with typing animation */}
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

      {/* Optional: Subtle overlay for focus */}
      <div className="fixed inset-0 bg-background/5 backdrop-blur-[0.5px] z-40 transition-opacity duration-300" />
    </>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
