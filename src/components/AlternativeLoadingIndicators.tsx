'use client';

import { useState, useEffect, memo } from 'react';

// Minimal loading indicator for better performance
const MinimalLoadingIndicator = memo(function MinimalLoadingIndicator() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (!visible) return null;
    return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-background/50">
      <div 
        className="h-full bg-primary animate-pulse" 
        style={{ 
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
          animation: 'loading-shimmer 1.5s ease-in-out infinite'
        }} 
      />
    </div>
  );
});

MinimalLoadingIndicator.displayName = 'MinimalLoadingIndicator';

// Toast-style loading indicator
const ToastLoadingIndicator = memo(function ToastLoadingIndicator() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(true);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-sm shadow-lg px-4 py-3 rounded-lg flex items-center gap-3 border border-border animate-in slide-in-from-bottom-4">
        <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-primary/30 border-t-primary"></div>
        <span className="text-sm text-foreground/80">Loading...</span>
      </div>
    </div>
  );
});

ToastLoadingIndicator.displayName = 'ToastLoadingIndicator';

export { MinimalLoadingIndicator, ToastLoadingIndicator };
