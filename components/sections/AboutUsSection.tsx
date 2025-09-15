"use client";
import { Globe, Users, Heart, Scale } from "lucide-react";
import { LinkPreview } from "@/components/ui/link-preview";
import { useEffect } from "react";

export function AboutUsSection() {
  // Prefetch the screenshot for faster loading
  useEffect(() => {
    const mitUrl = "https://professionalprograms.mit.edu/blog/design/why-95-of-new-products-miss-the-mark-and-how-yours-can-avoid-the-same-fate/";
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(mitUrl)}&screenshot=true&meta=false&embed=screenshot.url&colorScheme=dark&viewport.isMobile=true&viewport.deviceScaleFactor=1&viewport.width=900&viewport.height=540`;

    // Create invisible image to prefetch
    const img = new Image();
    img.src = screenshotUrl;
  }, []);

  const values = [
    {
      icon: Users,
      title: "Collaboration First",
      description:
        "We co-create with our partners, building solutions together, not in isolation.",
    },
    {
      icon: Heart,
      title: "Expertise with Empathy",
      description:
        "Decades of experience combined with deep understanding of people and business needs.",
    },
    {
      icon: Scale,
      title: "Impact at Scale",
      description:
        "We craft resilient technology trusted by millions worldwide.",
    },
    {
      icon: Globe,
      title: "Inclusive Innovation",
      description:
        "Pushing boundaries while staying grounded in equality and shared ownership.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <section id="about-us" className="px-6 pt-20 pb-0 lg:px-12">
        {/* Quote Hero */}
        <div className="text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-4 text-white font-heading">
            <span className="text-lime-green">"</span>
            <LinkPreview
              url="https://professionalprograms.mit.edu/blog/design/why-95-of-new-products-miss-the-mark-and-how-yours-can-avoid-the-same-fate/"
              className="text-font hover:text-lime-green/80 transition-colors duration-200 cursor-pointer"
              width={300}
              height={180}
            >
              95% products fail<sup>*</sup>
            </LinkPreview>
            — not because of the idea, but because of poor execution
            <span className="text-lime-green">"</span>
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            *
            <LinkPreview
              url="https://professionalprograms.mit.edu/blog/design/why-95-of-new-products-miss-the-mark-and-how-yours-can-avoid-the-same-fate/"
              className="text-gray-500 hover:text-lime-green transition-colors duration-200 ml-1"
              width={300}
              height={180}
            >
              MIT Professional Programs: Why 95% of New Products Miss the Mark
            </LinkPreview>
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              At Arktik, we believe ideas deserve better execution. That's why
              we don't just build software — we partner with you to combine
              strategy, design, and engineering, transforming your vision into
              products that actually work and drive measurable results.
            </p>
          </div>
        </div>

        {/* Three Column Story Layout */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mb-20 relative">
          {/* Who We Are */}
          <div className="space-y-6 pb-8 lg:pb-0 border-b lg:border-b-0 border-gray-700">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                Who We Are
              </h3>
              <div className="w-3/4 h-[2px] bg-lime-green mx-auto lg:mx-0"></div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We are a software development company with builders, strategists,
              designers, and engineers who have spent over 7 years creating
              software solutions that power millions of people and businesses
              worldwide.
            </p>
            <p className="text-gray-300 leading-relaxed">
              But more than that, we are{" "}
              <span className="text-lime-green font-medium">collaborators</span>
              . We believe the best solutions come from listening,
              understanding, and building together.
            </p>
          </div>

          {/* Vertical Separator 1 */}
          <div className="hidden lg:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-700 transform -translate-x-1/2"></div>

          {/* How We Work */}
          <div className="space-y-6 pb-8 lg:pb-0 border-b lg:border-b-0 border-gray-700">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                How We Work
              </h3>
              <div className="w-3/4 h-[2px] bg-lime-green mx-auto lg:mx-0"></div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              With every project, we bring not only technical depth but also
              empathy, inclusivity, and a shared commitment to your goals.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We work{" "}
              <span className="text-lime-green font-medium">
                equally, inclusively, and with curiosity
              </span>{" "}
              to push the boundaries of what software can do for businesses and
              the people behind them.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our 7+ years of global experience means we know what works — and
              we bring that knowledge into every collaboration.
            </p>
          </div>

          {/* Vertical Separator 2 */}
          <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-[1px] bg-gray-700 transform -translate-x-1/2"></div>

          {/* What We Believe */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                What We Believe
              </h3>
              <div className="w-3/4 h-[2px] bg-lime-green mx-auto lg:mx-0"></div>
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <value.icon className="w-5 h-5 text-lime-green" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        {value.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
