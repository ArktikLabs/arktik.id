import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { WhyArktikSection } from "@/components/sections/WhyArktikSection"
import { AboutUsSection } from "@/components/sections/AboutUsSection"
import { WorksSection } from "@/components/sections/WorksSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { FooterSection } from "@/components/sections/FooterSection"

export default function Home() {
  return (
    <div className="min-h-screen text-white bg-dark-blue">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <WhyArktikSection />
      <WorksSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}