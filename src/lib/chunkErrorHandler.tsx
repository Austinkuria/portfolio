'use client';

/**
 * This module adds client-side error handling for chunk loading errors 
 * which can occur during development or in production.
 */

// Store page reload attempts to prevent infinite reload loops
let reloadAttempts = 0;
const MAX_RELOAD_ATTEMPTS = 3;

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
  window.addEventListener('error', (event) => {
    // Check if this is a chunk loading error
    if (
      (event.error?.name === 'ChunkLoadError' || event.message?.includes('Loading chunk')) ||
      (event.target && event.target instanceof HTMLScriptElement && event.target.src.includes('/_next/'))
    ) {
      console.error('Chunk loading error detected', event);
      
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
          }, 2000);
          
        } catch (e) {
          console.error('Error during chunk error recovery:', e);
        }
      } else {
        console.error('Max reload attempts reached. Manual refresh required.');
        showMaxAttemptsNotification();
      }
      return true;
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
      <div style="font-weight: 600;">Loading issue detected</div>
    </div>
    <div style="margin-top: 4px;">
      Reloading page to fix this issue (${reloadAttempts}/${MAX_RELOAD_ATTEMPTS})...
    </div>
  `;
  
  document.body.appendChild(notification);
}

// Show notification when max attempts is reached
function showMaxAttemptsNotification() {
  const notificationId = 'max-attempts-notification';
  if (document.getElementById(notificationId)) return;
  
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.style.position = 'fixed';
  notification.style.top = '50%';
  notification.style.left = '50%';
  notification.style.transform = 'translate(-50%, -50%)';
  notification.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  notification.style.color = '#1f2937';
  notification.style.padding = '20px 24px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '450px';
  notification.style.textAlign = 'center';
  notification.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  notification.innerHTML = `
    <div style="font-weight: 600; font-size: 18px; margin-bottom: 12px;">Unable to load the page</div>
    <div style="margin-bottom: 16px;">
      We've tried multiple times to load the page, but it seems there might be an issue with your connection or the site's resources.
    </div>
    <button id="manual-reload" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: 500; cursor: pointer;">
      Try Again
    </button>
    <button id="clear-storage" style="background-color: transparent; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 4px; margin-left: 8px; font-weight: 500; cursor: pointer;">
      Clear Cache & Reload
    </button>
  `;
  
  document.body.appendChild(notification);
  
  document.getElementById('manual-reload')?.addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('clear-storage')?.addEventListener('click', () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('Error clearing storage:', e);
      window.location.reload();
    }
  });
}

// Type definitions for global window object
declare global {
  interface Window {
    __CHUNK_ERROR_HANDLER_INITIALIZED__?: boolean;
  }
}
