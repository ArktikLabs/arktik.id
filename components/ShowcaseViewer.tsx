'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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
          className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transition-all duration-300 ease-out"
          style={{
            width: Math.min(currentSize.width, windowSize.width - 50),
            maxWidth: '100%',
            height: Math.min(currentSize.height + 40, windowSize.height - 100),
            maxHeight: 'calc(100vh - 100px)'
          }}
        >
          {/* Browser Chrome */}
          <div className="bg-gray-700 px-4 py-2 flex items-center gap-2 border-b border-gray-600">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-gray-300 truncate">{link}</span>
            </div>
          </div>

          {/* iframe */}
          <div
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