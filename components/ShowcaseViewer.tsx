'use client';

import { useState, useEffect } from 'react';

interface ShowcaseViewerProps {
  title: string;
  link: string;
  activeViewport?: ViewportType;
}

type ViewportType = 'mobile' | 'tablet' | 'desktop';


export function ShowcaseViewer({ title, link, activeViewport = 'desktop' }: ShowcaseViewerProps) {
  const [windowSize, setWindowSize] = useState({ width: 1440, height: 900 });

  const viewportSizes = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1440, height: 900 }
  };

  const currentSize = viewportSizes[activeViewport];

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    updateWindowSize();

    // Add event listener
    window.addEventListener('resize', updateWindowSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);


  return (
    <div className="relative w-full h-full flex flex-col">
      {/* iframe Container */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div
          className="overflow-hidden rounded-card border border-rule bg-paper-2"
          style={{
            width: Math.min(currentSize.width, windowSize.width - 50),
            maxWidth: '100%',
            height: Math.min(currentSize.height + 40, windowSize.height - 100),
            maxHeight: 'calc(100vh - 100px)'
          }}
        >
          {/* Typographic frame. The iframe below is a real live site, so it gets
            * a label — but not hand-drawn macOS traffic lights. The reader
            * already has real browser chrome around this page. */}
          <div className="flex items-center justify-between gap-3 border-b border-rule bg-paper px-4 py-2.5">
            <span className="label-mono truncate">{link}</span>
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime-green"
              aria-hidden="true"
            />
          </div>

          {/* iframe */}
          <div
            /* Deliberately NOT a design token: this is the loading ground behind
             * a third-party site in an iframe. Tinting it brand-blue makes the
             * client's own site look mis-coloured while it loads. */
            className="relative bg-white"
            style={{
              height: Math.min(currentSize.height, windowSize.height - 140),
              maxHeight: 'calc(100vh - 140px)'
            }}
          >
            <iframe
              src={link}
              title={title}
              className="w-full h-full border-0"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}