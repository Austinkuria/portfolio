'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import LogoSpinner from '@/components/common/LogoSpinner';

const LoadingIndicator = memo(function LoadingIndicator() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(20);
  const [currentMessage, setCurrentMessage] = useState('Loading...');
  const [timeExpired, setTimeExpired] = useState(false);
  
  useEffect(() => {
    // Set a maximum time for the loading indicator to prevent getting stuck
    const maxTimeoutId = setTimeout(() => {
      setTimeExpired(true);
    }, 6000); // Maximum 6 seconds before force completing
    
    return () => {
      clearTimeout(maxTimeoutId);
    };
  }, []);

  // Optimize progress calculation with useCallback
  const updateProgress = useCallback(() => {
    setProgress(prev => {
      const increment = prev < 40 ? 15 : prev < 70 ? 10 : prev < 90 ? 6 : 3;
      const newProgress = Math.min(prev + increment, 98);
      
      // Update message based on progress
      if (newProgress < 40) setCurrentMessage('Loading...');
      else if (newProgress < 75) setCurrentMessage('Fetching content...');
      else setCurrentMessage('Almost ready...');
      
      return newProgress;
    });
  }, []);

  // Simulate progress for better UX
  useEffect(() => {
    if (!visible) return;
    const progressInterval = setInterval(updateProgress, 90);
    return () => clearInterval(progressInterval);
  }, [visible, updateProgress]);
  
  // Force complete loading if time expired
  useEffect(() => {
    if (timeExpired) {
      setProgress(100);
      const forceCompleteTimeout = setTimeout(() => {
        const customEvent = new Event('navigationComplete', { bubbles: true });
        document.dispatchEvent(customEvent);
      }, 300);
      return () => clearTimeout(forceCompleteTimeout);
    }
  }, [timeExpired]);
  
  if (!visible || progress >= 100) return null;
  
  return (
    <>
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-background/50 pointer-events-none">
        <div 
          className="h-full bg-primary"
          style={{ 
            width: `${progress}%`,
            transition: 'width 100ms ease-out'
          }}
        />
      </div>

      {/* Floating AM LABS LogoSpinner Card */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none select-none">
        <div className="bg-background/95 backdrop-blur-md shadow-2xl px-5 py-3 rounded-2xl flex items-center gap-3.5 border border-border/80">
          {/* Animated AM LABS Dual-Arc LogoSpinner */}
          <LogoSpinner size={36} />

          {/* Loading status text */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-tight flex items-center">
              AM LABS
              <span className="text-primary ml-1">·</span>
              <span className="text-xs text-muted-foreground font-normal ml-1.5">{currentMessage}</span>
            </span>
          </div>

          {/* Progress percentage */}
          <div className="text-xs font-mono font-medium text-primary ml-2 min-w-[3ch]">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </>
  );
});

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
