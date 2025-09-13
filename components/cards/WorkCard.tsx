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
        <Card className="bg-service-blue border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/10 group cursor-pointer overflow-hidden hover:bg-opacity-80">
          <div className="relative h-64 bg-slate-700">
            <Image src={imageSrc} alt={title} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm group-hover:translate-y-full transition-all duration-300 p-4">
              <h3 className="text-xl font-bold text-lime-green font-heading">
                {title}
              </h3>
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
    <Card className="bg-service-blue border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/10 group cursor-pointer hover:bg-opacity-80" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="w-8 h-8 bg-slate-700 rounded mb-4 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white font-heading">
          {title}
        </h3>
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}
        <Button
          variant="link"
          className="text-lime-green hover:text-lime-green p-0 h-auto font-medium"
        >
          {buttonText} <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
