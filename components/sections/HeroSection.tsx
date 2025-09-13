"use client";

import { FlipWords } from "@/components/ui/flip-words";
import { InteractiveDemo } from "@/components/ui/interactive-demo";
import { useEffect, useState } from "react";
import Image from "next/image";

export function HeroSection() {
  const words = [
    "clear",
    "fast",
    "purposeful",
    "beautiful",
    "modern",
    "accessible",
  ];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/aurora-bg.webp')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-dark-blue z-[1]" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="px-6 lg:px-12 h-screen flex items-start pt-[25vh] relative">
          <div className="flex items-start justify-between w-full gap-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance font-heading">
                Building <FlipWords words={words} className="text-lime-green" />{" "}
                digital experiences
              </h1>
            </div>
            <div className="hidden lg:block flex-shrink-0">
              <InteractiveDemo />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to explore */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 z-20 transition-all duration-500 md:bottom-0 md:!top-auto ${
          isScrolled ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
        style={{
          top: "calc(100dvh - 4rem)",
        }}
      >
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={() => {
              const servicesSection = document.getElementById("services");
              servicesSection?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-gray-400 text-xs font-light text-center hover:text-lime-green transition-colors duration-300 cursor-pointer font-sans tracking-wide uppercase lg:order-2"
          >
            Scroll to explore
          </button>
          <div className="relative w-px h-12 bg-gradient-to-b from-lime-green via-lime-green/75 to-lime-green/50 overflow-hidden lg:order-1">
            <div
              className="absolute inset-x-0 w-px h-8 bg-gradient-to-b from-transparent via-lime-green to-transparent animate-pulse opacity-80"
              style={{
                animation: "laser 2s ease-in-out infinite",
                animationDelay: "0s",
              }}
            ></div>
          </div>
          <style jsx>{`
            @keyframes laser {
              0% {
                transform: translateY(-100%);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                transform: translateY(300%);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
