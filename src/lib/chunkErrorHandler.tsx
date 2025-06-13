'use client';

/**
 * This module adds client-side error handling for chunk loading errors 
 * which can occur during development or in production.
 */

// Store page reload attempts to prevent infinite reload loops
let reloadAttempts = 0;
const MAX_RELOAD_ATTEMPTS = 2; // Reduced from 3 to be less aggressive

/**
 * Initialize chunk error handling when the component mounts
 */
export function initChunkErrorHandling() {
  if (typeof window === 'undefined') return;
  
  // Only register once
  if (window.__CHUNK_ERROR_HANDLER_INITIALIZED__) return;
  window.__CHUNK_ERROR_HANDLER_INITIALIZED__ = true;
  
  // Get reload attempts from sessionStorage
  try {
    const storedAttempts = sessionStorage.getItem('chunkErrorReloadAttempts');
    reloadAttempts = storedAttempts ? parseInt(storedAttempts, 10) : 0;
  } catch (e) {
    console.error('Error accessing sessionStorage:', e);
  }

  // Handle chunk loading errors
  window.addEventListener('error', (event) => {    // Check if this is a chunk loading error that's truly critical
    const isScriptSrc = event.target && 
      event.target instanceof HTMLScriptElement && 
      event.target.src.includes('/_next/');
    
    // Only reload for actual chunk errors or critical script failures
    const isCriticalError = 
      (event.error?.name === 'ChunkLoadError') || 
      (event.message?.includes('Loading chunk') && event.message?.includes('failed')) ||
      (isScriptSrc && (
        (event.target instanceof HTMLScriptElement && event.target.src.includes('main')) || 
        (event.target instanceof HTMLScriptElement && event.target.src.includes('webpack'))
      ));
      
    if (isCriticalError) {
      console.error('Critical chunk loading error detected', event);
      event.preventDefault();
      
      // Prevent infinite reload loops
      if (reloadAttempts < MAX_RELOAD_ATTEMPTS) {
        try {
          reloadAttempts++;
          sessionStorage.setItem('chunkErrorReloadAttempts', reloadAttempts.toString());
          
          console.log(`Chunk load error recovery attempt ${reloadAttempts}/${MAX_RELOAD_ATTEMPTS}`);
          
          // Create a notification
          showChunkErrorNotification();
          
          // Reload after a brief delay
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Reduced from 2000ms
          
        } catch (e) {
          console.error('Error during chunk error recovery:', e);
        }
      } else {
        console.error('Max reload attempts reached. Manual refresh required.');
        showMaxAttemptsNotification();
      }
      return true;
    }
    
    // For non-critical errors, log but don't reload
    if (event.target && event.target instanceof HTMLScriptElement && event.target.src.includes('/_next/')) {
      console.warn('Non-critical script loading error, continuing without reload:', event.target.src);
      return false;
    }
    
    return false;
  }, true);
  
  // Reset reload attempts if the page loads successfully
  window.addEventListener('load', () => {
    try {
      reloadAttempts = 0;
      sessionStorage.setItem('chunkErrorReloadAttempts', '0');
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
    }
  });
}

// Show a notification about the chunk error
function showChunkErrorNotification() {
  const notificationId = 'chunk-error-notification';
  if (document.getElementById(notificationId)) return;
  
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'rgba(229, 231, 235, 0.9)';
  notification.style.color = '#1f2937';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '6px';
  notification.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';
  notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  notification.style.fontSize = '14px';
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div>
        <p style="margin: 0; font-weight: 500;">Loading issue detected</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.8;">Refreshing to fix the problem...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after a delay
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Show notification when max attempts reached
function showMaxAttemptsNotification() {
  const notificationId = 'max-attempts-notification';
  if (document.getElementById(notificationId)) return;
  
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'rgba(254, 226, 226, 0.95)';
  notification.style.color = '#991b1b';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '6px';
  notification.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';
  notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  notification.style.fontSize = '14px';
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div>
        <p style="margin: 0; font-weight: 500;">Unable to load page</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.8;">Please try refreshing the page manually.</p>
      </div>
    </div>
    <button id="manual-refresh-btn" style="display: block; margin-top: 8px; padding: 6px 12px; background-color: #991b1b; color: white; border: none; border-radius: 4px; cursor: pointer; width: 100%;">
      Refresh Now
    </button>
  `;
  
  document.body.appendChild(notification);
  
  // Add click handler for the refresh button
  document.getElementById('manual-refresh-btn')?.addEventListener('click', () => {
    window.location.reload();
  });
}

// Type definitions for global window object
declare global {
  interface Window {
    __CHUNK_ERROR_HANDLER_INITIALIZED__?: boolean;
  }
}
