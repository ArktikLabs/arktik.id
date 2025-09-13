import { Globe, Users, Heart, Scale } from "lucide-react";

export function AboutUsSection() {
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
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-8 text-white font-heading">
            <span className="text-lime-green">"</span>Most digital products fail
            — not because of the idea, but because of poor execution
            <span className="text-lime-green">"</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
              At Arktik, we believe ideas deserve better. That's why we combine
              strategy, design, and engineering to transform your vision into
              software that actually works — reliable, scalable, and
              user-friendly
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
              We are builders, strategists, designers, and engineers who have
              spent the last decade creating technology that powers millions of
              people and businesses worldwide.
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
