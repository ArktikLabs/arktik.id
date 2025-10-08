'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { ShowcaseViewer } from './ShowcaseViewer';

interface ShowcaseContainerProps {
  title: string;
  link: string;
}

type ViewportType = 'mobile' | 'tablet' | 'desktop';

function ViewportControls({ activeViewport, onViewportChange }: {
  activeViewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
}) {
  return (
    <div className="flex bg-white/10 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => onViewportChange('mobile')}
        className={`p-2 rounded-full transition-all duration-200 ${
          activeViewport === 'mobile'
            ? 'bg-lime-green text-dark-blue'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        title="Mobile View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 19H7V5h10v14zm-1-16H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
      </button>
      <button
        onClick={() => onViewportChange('tablet')}
        className={`p-2 rounded-full transition-all duration-200 ${
          activeViewport === 'tablet'
            ? 'bg-lime-green text-dark-blue'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        title="Tablet View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 12H4V6h16v10z"/>
        </svg>
      </button>
      <button
        onClick={() => onViewportChange('desktop')}
        className={`p-2 rounded-full transition-all duration-200 ${
          activeViewport === 'desktop'
            ? 'bg-lime-green text-dark-blue'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
        title="Desktop View"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 12H4V4h16v10z"/>
        </svg>
      </button>
    </div>
  );
}

export function ShowcaseContainer({ title, link }: ShowcaseContainerProps) {
  const [activeViewport, setActiveViewport] = useState<ViewportType>('desktop');

  return (
    <div className="min-h-screen w-full bg-dark-blue">
      {/* Header matching Header.tsx styling */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-dark-blue/30 backdrop-blur-lg backdrop-saturate-180 border-b border-white/8">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            ← Back to Homepage
          </Link>

          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bricolage-grotesque font-semibold text-white">{title}</h1>

            <div className="flex items-center gap-3">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-lime-green hover:bg-lime-green/90 text-dark-blue px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                Visit Live
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>

              <ViewportControls
                activeViewport={activeViewport}
                onViewportChange={setActiveViewport}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Full-width Showcase Viewer with top padding for fixed header */}
      <div className="pt-20">
        <ShowcaseViewer
          title={title}
          link={link}
          activeViewport={activeViewport}
        />
      </div>
    </div>
  );
}