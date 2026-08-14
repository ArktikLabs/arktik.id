'use client';

/* Hallmark · macrostructure: 05 Workbench · design-system: design.md
 * Workbench pages are "small, functional — they don't shout", so the chrome
 * here stays a thin instrument bar and the client's live site is the content.
 * What changed:
 *   · The title carried `font-bricolage-grotesque` — a class defined nowhere,
 *     naming the face design.md retired for Archivo. It was silently falling
 *     back to body font. Now font-heading.
 *   · "Visit Live" and the three viewport tooltips were hardcoded English on a
 *     bilingual site, while showcase.viewport.* already existed unused.
 *   · border-white/8 was a raw colour on a token-locked project.
 *   · The viewport toggle is a real radiogroup now — it had no pressed state
 *     for assistive tech, only a native title tooltip. */

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Smartphone, Tablet, Monitor, ArrowUpRight } from 'lucide-react';
import { ShowcaseViewer } from './ShowcaseViewer';

interface ShowcaseContainerProps {
  title: string;
  link: string;
}

type ViewportType = 'mobile' | 'tablet' | 'desktop';

const VIEWPORTS = [
  { key: 'mobile', Icon: Smartphone },
  { key: 'tablet', Icon: Tablet },
  { key: 'desktop', Icon: Monitor },
] as const;

function ViewportControls({
  activeViewport,
  onViewportChange,
}: {
  activeViewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
}) {
  const t = useTranslations('showcase');

  return (
    <div
      role="radiogroup"
      aria-label={t('viewingIn')}
      className="flex rounded-pill bg-paper-3 p-1"
    >
      {VIEWPORTS.map(({ key, Icon }) => {
        const isActive = activeViewport === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={t(`viewport.${key}`)}
            onClick={() => onViewportChange(key)}
            className={`rounded-pill p-2 transition-colors duration-200 ${
              isActive
                ? 'bg-lime-green text-carbon'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

export function ShowcaseContainer({ title, link }: ShowcaseContainerProps) {
  const [activeViewport, setActiveViewport] = useState<ViewportType>('desktop');
  const t = useTranslations('showcase');

  return (
    <div className="min-h-screen w-full bg-paper">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" aria-label="Go to homepage" className="shrink-0">
              <Image
                src="/assets/logo.svg"
                alt="arktik"
                width={0}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <h1 className="truncate font-heading text-lg font-bold text-ink">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-lime-green px-4 py-2 text-sm font-semibold text-carbon transition-colors duration-200 hover:bg-lime-green/90"
            >
              {t('visitLive')}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <ViewportControls
              activeViewport={activeViewport}
              onViewportChange={setActiveViewport}
            />
          </div>
        </div>
      </header>

      <div className="pt-24">
        <ShowcaseViewer
          title={title}
          link={link}
          activeViewport={activeViewport}
        />
      </div>
    </div>
  );
}
