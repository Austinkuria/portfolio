'use client';

import { forwardRef, useState } from 'react';
import Link, { LinkProps } from 'next/link';

interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(({ children, onClick, ...props }, ref) => {
    // Preload navigation data before clicking
    const [preloaded, setPreloaded] = useState(false);
    
    // Intelligently handle navigation start
    const handleClick = () => {
      // Only dispatch navigation event if it's an internal link that will cause navigation
      const willNavigate = typeof props.href === 'string' && 
        !props.href.startsWith('http') && 
        !props.href.startsWith('#') &&
        !props.href.startsWith('/api/') &&
        props.target !== '_blank';
      
      if (willNavigate) {
        // Dispatch navigation start event
        window.dispatchEvent(new Event('navigationStart'));
      }
      
      // Call original onClick if provided
      if (onClick) {
        onClick();
      }
    };
    
    // Determine if this is an internal link that should be prefetched
    const isInternalLink = typeof props.href === 'string' && 
      !props.href.startsWith('http') && 
      !props.href.startsWith('#') &&
      !props.href.startsWith('/api/');

    // Preload data on hover for faster navigation
    const handleMouseEnter = () => {
      if (isInternalLink && !preloaded) {        // Manually preload route data
        const href = props.href.toString();
        const prefetchUrl = href.startsWith('/') ? href : `/${href}`;
        
        // Prefetch the route data
        try {
          fetch(prefetchUrl, { priority: 'high' }).catch(() => {});
          setPreloaded(true);
        } catch {
          // Ignore errors in prefetching
        }
      }
    };
    
    return (      <Link 
        {...props} 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        ref={ref} 
        prefetch={isInternalLink}
      >
        {children}
      </Link>
    );
  }
);

CustomLink.displayName = 'CustomLink';

export default CustomLink;
