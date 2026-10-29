'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-primary/70 text-sm font-medium">
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary animate-ping mr-2.5" />
      Initializing Global Tech Network...
    </div>
  ),
});

const ARC_REL_LEN = 0.5;
const FLIGHT_TIME = 2000;

interface TechHub {
  lat: number;
  lng: number;
  name: string;
  isHub?: boolean;
}

// Primary Core Hub
const primaryHub: TechHub = { lat: -1.2921, lng: 36.8219, name: 'Core HQ', isHub: true };

// Major global technology & financial hubs connected to AM Softwares Ke
const techHubs: TechHub[] = [
  primaryHub,
  { lat: 51.5074, lng: -0.1278, name: 'London' },
  { lat: 40.7128, lng: -74.006, name: 'New York' },
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
  { lat: 25.2048, lng: 55.2708, name: 'Dubai' },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  { lat: 52.52, lng: 13.405, name: 'Berlin' },
  { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
];

export default function AnimatedGlobe() {
  const globeEl = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.7;
      globeEl.current.controls().enableZoom = false;
      // Proportioned camera view focused near East Africa / Indian Ocean, giving comfortable clearance from headers
      globeEl.current.pointOfView({ lat: 8, lng: 36, altitude: 1.85 }, 2000);
    }
  }, [globeEl.current, dimensions]);

  // Cybernetic data pipeline arcs connecting primary core to international tech nodes
  const arcsData = techHubs
    .filter((h) => !h.isHub)
    .map((city) => ({
      startLat: primaryHub.lat,
      startLng: primaryHub.lng,
      endLat: city.lat,
      endLng: city.lng,
      color: isDark
        ? ['#00f0ff', '#3b82f6', '#a855f7']
        : ['#0284c7', '#2563eb', '#7c3aed'],
    }));

  // Concentric radar pulses radiating from Nairobi & secondary pings at partner hubs
  const ringsData = techHubs.map((city) => ({
    lat: city.lat,
    lng: city.lng,
    maxR: city.isHub ? 12 : 5,
    propagationSpeed: city.isHub ? 2.5 : 1.2,
    repeatPeriod: city.isHub ? 900 : 1600,
  }));

  // Glowing 3D Tech Data Points
  const pointsData = techHubs.map((city) => ({
    lat: city.lat,
    lng: city.lng,
    size: city.isHub ? 1.4 : 0.8,
    color: city.isHub ? '#00f0ff' : isDark ? '#38bdf8' : '#2563eb',
    altitude: city.isHub ? 0.04 : 0.02,
  }));

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-move flex items-center justify-center">
      {dimensions.width > 0 && (
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          // Dark stylized tech map
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          // Futuristic coordinate grid (telemetry / radar look)
          showGraticules={true}
          
          // Cybernetic atmosphere halo
          showAtmosphere={true}
          atmosphereColor={isDark ? '#00f0ff' : '#3b82f6'}
          atmosphereAltitude={0.24}
          
          // High-speed cyber data beams
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={ARC_REL_LEN}
          arcDashGap={1.6}
          arcDashInitialGap={() => Math.random() * 4}
          arcDashAnimateTime={FLIGHT_TIME}
          arcStroke={2.2}
          arcAltitude={0.34}
          
          // Concentric radar pulses
          ringsData={ringsData}
          ringColor={() => (t: number) =>
            isDark
              ? `rgba(0, 240, 255, ${(1 - t) * 0.95})`
              : `rgba(37, 99, 235, ${(1 - t) * 0.95})`
          }
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          
          // Luminous Tech Nodes
          pointsData={pointsData}
          pointColor="color"
          pointAltitude="altitude"
          pointRadius="size"
        />
      )}
    </div>
  );
}
