import { Header } from "@/components/sections/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { WorksSection } from "@/components/sections/WorksSection"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { WhyArktikSection } from "@/components/sections/WhyArktikSection"
import { AboutUsSection } from "@/components/sections/AboutUsSection"
import { BlogSection } from "@/components/sections/BlogSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { FooterSection } from "@/components/sections/FooterSection"

/* Hallmark · macrostructure: 01 Bento Grid · design-system: design.md v2
 *
 * Order is the argument the page makes to a buyer who has never heard of you:
 *   work        — you have shipped things
 *   process     — here is exactly what happens, and what it costs
 *   capabilities— here is what we do
 *   why         — here is why us
 *   about       — here is how we think
 *   writing     — here is proof we know the field
 * Process sits at position 3 because it is the only trust lever available to a
 * firm with a thin portfolio and founders who stay anonymous. */

interface HomeProps {
  params: { locale: string }
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main id="main">
        <HeroSection />
        <WorksSection />
        {/* Stage durations live in messages/*.json (process.stages.*.duration)
          * so they translate. Every one is a PROMISE you have to keep — change
          * any you cannot hold to, or blank it to show "to confirm". */}
        <ProcessSection />
        <ServicesSection />
        <WhyArktikSection />
        <AboutUsSection />
        <BlogSection locale={locale} />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
