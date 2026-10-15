'use client';

import { useEffect, useRef } from 'react';
import { display, trail } from '@/lib/fonts';
import { startTrail } from './engine';

// capa fija del cursor; la del hero vive en el propio hero (#heroTrail)
export function Trail() {
  const pageRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const hero = document.getElementById('top'), heroCanvas = document.getElementById('heroTrail');
    if (!pageRef.current || !hero || !(heroCanvas instanceof HTMLCanvasElement)) return;
    return startTrail({
      hero,
      heroCanvas,
      drawArea: document.getElementById('drawArea'),
      pageCanvas: pageRef.current,
      trailFont: trail.style.fontFamily,
      displayFont: display.style.fontFamily,
    });
  }, []);
  return <canvas ref={pageRef} className="trail-canvas" aria-hidden="true" />;
}
