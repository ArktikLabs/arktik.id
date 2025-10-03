import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { WhyArktikSection } from "@/components/sections/WhyArktikSection"
import { AboutUsSection } from "@/components/sections/AboutUsSection"
import { WorksSection } from "@/components/sections/WorksSection"
import { BlogSection } from "@/components/sections/BlogSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { FooterSection } from "@/components/sections/FooterSection"

interface HomeProps {
  params: { locale: string }
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  return (
    <div className="min-h-screen text-white bg-dark-blue">
      <Header />
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <WhyArktikSection />
      <WorksSection />
      <BlogSection locale={locale} />
      <ContactSection />
      <FooterSection />
    </div>
  );
}