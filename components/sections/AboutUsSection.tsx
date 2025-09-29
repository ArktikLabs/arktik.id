"use client";
import { Globe, Users, Heart, Scale } from "lucide-react";
import { LinkPreview } from "@/components/ui/link-preview";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function AboutUsSection() {
  const t = useTranslations('aboutUs')

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
      title: t('whatWeBelieve.values.collaboration.title'),
      description: t('whatWeBelieve.values.collaboration.description'),
    },
    {
      icon: Heart,
      title: t('whatWeBelieve.values.expertise.title'),
      description: t('whatWeBelieve.values.expertise.description'),
    },
    {
      icon: Scale,
      title: t('whatWeBelieve.values.impact.title'),
      description: t('whatWeBelieve.values.impact.description'),
    },
    {
      icon: Globe,
      title: t('whatWeBelieve.values.innovation.title'),
      description: t('whatWeBelieve.values.innovation.description'),
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
              {t('quoteText')}<sup>*</sup>
            </LinkPreview>
            <span className="text-lime-green">"</span>
          </h2>
          <div className="text-xs text-gray-500 mb-5">
            *
            <LinkPreview
              url="https://professionalprograms.mit.edu/blog/design/why-95-of-new-products-miss-the-mark-and-how-yours-can-avoid-the-same-fate/"
              className="text-gray-500 hover:text-lime-green transition-colors duration-200 ml-1"
              width={300}
              height={180}
            >
              {t('quoteSource')}
            </LinkPreview>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              {t('mainDescription')}
            </p>
          </div>
        </div>

        {/* Three Column Story Layout */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mb-20 relative">
          {/* Who We Are */}
          <div className="space-y-6 pb-8 lg:pb-0 border-b lg:border-b-0 border-gray-700">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                {t('whoWeAre.title')}
              </h3>
              <div className="w-3/4 h-[2px] bg-lime-green mx-auto lg:mx-0"></div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('whoWeAre.description1')}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t('whoWeAre.description2')}
            </p>
          </div>

          {/* Vertical Separator 1 */}
          <div className="hidden lg:block absolute left-1/3 top-0 bottom-0 w-[1px] bg-gray-700 transform -translate-x-1/2"></div>

          {/* How We Work */}
          <div className="space-y-6 pb-8 lg:pb-0 border-b lg:border-b-0 border-gray-700">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                {t('howWeWork.title')}
              </h3>
              <div className="w-3/4 h-[2px] bg-lime-green mx-auto lg:mx-0"></div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('howWeWork.description1')}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t('howWeWork.description2')}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {t('howWeWork.description3')}
            </p>
          </div>

          {/* Vertical Separator 2 */}
          <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-[1px] bg-gray-700 transform -translate-x-1/2"></div>

          {/* What We Believe */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 font-heading">
                {t('whatWeBelieve.title')}
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
