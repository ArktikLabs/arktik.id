"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

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
  buttonText = "Learn more",
  isImageCard = false,
  onClick,
}: WorkCardProps) {
  if (isImageCard && imageSrc) {
    const CardWrapper = ({ children }: { children: React.ReactNode }) =>
      href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {children}
        </a>
      ) : (
        <>{children}</>
      );

    return (
      <CardWrapper>
        <Card className="bg-gradient-to-br from-service-blue via-service-blue/95 to-slate-800/50 border-slate-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-lime-400/20 group cursor-pointer overflow-hidden hover:border-lime-400/30 hover:scale-[1.02] transform-gpu h-full p-0">
          <div className="relative h-full bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-sm group-hover:translate-y-full transition-all duration-500 p-4">
              <h3 className="text-xl font-bold text-lime-green font-heading drop-shadow-lg">
                {title}
              </h3>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-6 h-6 text-lime-green drop-shadow-lg" />
            </div>
          </div>
        </Card>
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
            {buttonText}
          </Button>
          <ArrowUpRight className="w-4 h-4 text-lime-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
        </div>
      </CardContent>
    </Card>
  );
}
