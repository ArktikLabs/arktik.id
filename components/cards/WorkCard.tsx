"use client"

import { CTAButton } from "@/components/ui/cta-button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

/* Hallmark · design-system: design.md
 * Image variant: real next/image instead of an inline background-image, so the
 * thumbnails are sized, lazy-loaded and responsive. ONE hover signal (the scrim
 * deepens). The corner arrow now has a resting state — it used to be opacity-0
 * until hover, which meant touch users never saw the affordance at all. */

interface WorkCardProps {
  title: string;
  href?: string;
  imageSrc?: string;
  description?: string;
  buttonText?: string;
  isImageCard?: boolean;
  onClick?: () => void;
}

export function WorkCard({
  title,
  href,
  imageSrc,
  description,
  buttonText,
  isImageCard = false,
  onClick,
}: WorkCardProps) {
  const t = useTranslations('cards')

  if (isImageCard && imageSrc) {
    return (
      <Link
        href={href ?? "#"}
        className="group relative isolate flex h-96 flex-col justify-between overflow-hidden rounded-card p-5"
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="-z-10 object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="img-scrim absolute inset-0 -z-10"
        />

        <div className="flex items-start justify-between gap-3">
          <span className="label-mono flex items-center gap-2 text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-green" aria-hidden="true" />
            {t('project')}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-lime-green opacity-70 transition-opacity duration-200 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>

        <div>
          <h3 className="line-clamp-2 font-heading text-xl font-bold text-ink md:text-2xl">
            {title}
          </h3>
          {description && (
            <p className="mt-2 line-clamp-3 text-sm text-ink-2">{description}</p>
          )}
        </div>
      </Link>
    );
  }

  // CTA variant — closes the proof grid with the page's primary action.
  const handleClick = () => {
    if (onClick) return onClick();
    if (!href) return;
    if (href.startsWith('#')) {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(href, '_blank', 'noopener');
    }
  };

  return (
    <div className="flex h-full min-h-[18rem] flex-col justify-between gap-8 rounded-card border border-rule bg-paper-2 p-6">
      <div>
        <h3 className="font-heading text-xl font-bold text-ink md:text-2xl">
          {title}
        </h3>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-ink-2">{description}</p>
        )}
      </div>

      <CTAButton variant="small" className="self-start" onClick={handleClick}>
        {buttonText || t('learnMore')}
      </CTAButton>
    </div>
  );
}
