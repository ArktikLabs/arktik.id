"use client"

import { CTAButton } from "@/components/ui/cta-button"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

export function Header() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  
  const aboutUsRef = useRef<HTMLAnchorElement>(null);
  const servicesRef = useRef<HTMLAnchorElement>(null);
  const whyArktikRef = useRef<HTMLAnchorElement>(null);
  const portfolioRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate progress within hero section (0 to 1)
      const progress = Math.min(scrollY / (heroHeight - 100), 1);
      setScrollProgress(progress);

      // Detect active section
      const sections = ["about-us", "services", "why-arktik", "portfolio"];
      const scrollPosition = scrollY + 100; // Add offset for header

      let currentSection = "";

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);

      // Update indicator position based on active section
      let activeRef: React.RefObject<HTMLAnchorElement> | null = null;
      switch (currentSection) {
        case "about-us":
          activeRef = aboutUsRef;
          break;
        case "services":
          activeRef = servicesRef;
          break;
        case "why-arktik":
          activeRef = whyArktikRef;
          break;
        case "portfolio":
          activeRef = portfolioRef;
          break;
      }

      if (activeRef?.current) {
        const rect = activeRef.current.getBoundingClientRect();
        const navRect =
          activeRef.current.parentElement?.getBoundingClientRect();
        if (navRect) {
          setIndicatorStyle({
            left: rect.left - navRect.left,
            width: rect.width,
            opacity: 1,
          });
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Recalculate on resize

    // Initial calculation
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Calculate dynamic opacity and blur based on scroll progress
  const backgroundOpacity = scrollProgress > 0 ? Math.min(scrollProgress * 0.3, 0.3) : 0 // Starts at 0, goes to 0.3
  const blurAmount = scrollProgress > 0 ? Math.round(scrollProgress * 20) : 0 // Starts at 0, goes to 20px blur
  const borderOpacity = Math.max(0, Math.min((scrollProgress - 0.1) * 2, 0.08)) // Smooth transition from 10% to 50% scroll

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor:
          scrollProgress > 0
            ? `rgba(10, 10, 10, ${backgroundOpacity})`
            : "transparent",
        backdropFilter:
          scrollProgress > 0 ? `blur(${blurAmount}px) saturate(180%)` : "none",
        WebkitBackdropFilter:
          scrollProgress > 0 ? `blur(${blurAmount}px) saturate(180%)` : "none",
        borderLeft: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
        borderRight: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
        borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
        borderTop: "none",
        boxShadow:
          scrollProgress > 0.4
            ? "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 lg:px-12">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer"
          aria-label="Go to top of page"
        >
          <Image
            src="/logo.svg"
            alt="arktik"
            width={0}
            height={40}
            className="h-9 w-auto"
          />
        </button>
        <nav className="hidden md:flex items-center space-x-8 h-8 relative">
          {/* Animated background indicator */}
          <div
            className="absolute bg-lime-green/20 rounded-full h-10 transition-all duration-500 ease-out"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />
          <a
            ref={aboutUsRef}
            href="#about-us"
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium relative z-10 ${
              activeSection === "about-us"
                ? "text-lime-green"
                : "text-white hover:bg-black/30"
            }`}
          >
            About us
          </a>
          <a
            ref={servicesRef}
            href="#services"
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium relative z-10 ${
              activeSection === "services"
                ? "text-lime-green"
                : "text-white hover:bg-black/30"
            }`}
          >
            Our services
          </a>
          <a
            ref={whyArktikRef}
            href="#why-arktik"
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium relative z-10 ${
              activeSection === "why-arktik"
                ? "text-lime-green"
                : "text-white hover:bg-black/30"
            }`}
          >
            Why Arktik?
          </a>
          <a
            ref={portfolioRef}
            href="#portfolio"
            className={`px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium relative z-10 ${
              activeSection === "portfolio"
                ? "text-lime-green"
                : "text-white hover:bg-black/30"
            }`}
          >
            Our works
          </a>
        </nav>
        <CTAButton
          variant="small"
          className="text-sm"
          onClick={() => {
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Contact us
        </CTAButton>
      </div>
    </header>
  );
}
