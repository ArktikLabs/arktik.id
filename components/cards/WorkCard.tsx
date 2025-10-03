"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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
    const CardWrapper = ({ children }: { children: React.ReactNode }) =>
      href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full group/card"
        >
          {children}
        </a>
      ) : (
        <div className="w-full group/card">
          {children}
        </div>
      );

    return (
      <CardWrapper>
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl w-full flex flex-col justify-between p-4",
            "bg-cover bg-center"
          )}
          style={{
            backgroundImage: `url(${imageSrc})`
          }}
          onClick={onClick}
        >
          <div className="absolute w-full h-full top-0 left-0 bg-black/0 transition duration-300 group-hover/card:bg-black/30"></div>

          {/* Top section with project type */}
          <div className="flex flex-row items-center justify-between w-full z-10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-lime-green rounded-full"></div>
              <span className="font-normal text-base text-gray-50 relative z-10">
                {t('project')}
              </span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-lime-green opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="text content">
            <h3 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10 line-clamp-2">
              {title}
            </h3>
            {description && (
              <p className="font-normal text-sm text-gray-50 relative z-10 my-4 line-clamp-3">
                {description}
              </p>
            )}

            {/* Project Badge */}
            <div className="inline-block bg-lime-green/20 border border-lime-green/30 text-lime-green px-3 py-1 rounded text-xs font-medium relative z-10 mt-4">
              {buttonText || t('learnMore')}
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      if (href.startsWith('#')) {
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open(href, '_blank');
      }
    }
  };

  return (
    <Card
      className="bg-gradient-to-br from-service-blue via-service-blue/95 to-slate-800/50 border-slate-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-400/20 group cursor-pointer hover:border-lime-400/30 hover:scale-[1.02] transform-gpu relative overflow-hidden h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardContent className="p-6 relative z-10 flex flex-col h-full">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg mb-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <div className="w-5 h-5 bg-gradient-to-br from-white to-lime-green rounded-sm group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-white font-heading group-hover:text-lime-green/90 transition-colors duration-300">
          {title}
        </h3>
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 flex-grow">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <Button
            variant="link"
            className="text-lime-green hover:text-lime-green/80 p-0 h-auto font-medium transition-all duration-300 group-hover:translate-x-1"
          >
            {buttonText || t('learnMore')}
          </Button>
          <ArrowUpRight className="w-4 h-4 text-lime-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </CardContent>
    </Card>
  );
}
