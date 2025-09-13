import { Globe, Code, Users, TrendingUp, Zap, Target, Building2 } from "lucide-react"

export function AboutUsSection() {
  const stats = [
    { number: "10+", label: "Years", subtitle: "Building at scale" },
    { number: "Millions", label: "Users", subtitle: "Powered daily" },
    { number: "Global", label: "Impact", subtitle: "Across continents" },
  ]

  const expertise = [
    { icon: Target, label: "Product Leadership" },
    { icon: Code, label: "Engineering at Scale" },
    { icon: Building2, label: "Enterprise Design" },
  ]

  const drives = [
    {
      icon: Globe,
      title: "Global impact",
      description: "Products and platforms we've built are trusted by millions of users and suppliers worldwide."
    },
    {
      icon: Code,
      title: "Enterprise DNA", 
      description: "Deep expertise in B2B ecosystems, from supply chains and inventory systems to partner platforms."
    },
    {
      icon: Users,
      title: "End-to-end execution",
      description: "We operate across the full spectrum — product vision, technical architecture, and human-centered design."
    },
    {
      icon: TrendingUp,
      title: "Scale and resilience",
      description: "Every solution we create is built to last, adapt, and grow 10× beyond the first launch."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <section id="about-us" className="px-6 py-20 lg:px-12">
        {/* Hero Statement */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-8 text-white font-heading">
            About Us
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl lg:text-2xl text-lime-green font-medium mb-6">
              We are problem solvers and builders.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Strategists, designers, and engineers who have spent the last
              decade creating technology that powers millions of people and
              businesses worldwide.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mb-20 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="border border-gray-700 rounded-lg p-6 hover:border-lime-green/30 transition-all duration-300 hover:bg-gray-800/30">
                <div className="text-2xl lg:text-3xl font-bold text-lime-green mb-2 font-heading">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-gray-400 text-sm">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Expertise Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {expertise.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3 hover:border-lime-green/50 transition-all duration-300"
            >
              <item.icon className="w-5 h-5 text-lime-green" />
              <span className="text-white font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Our Focus</h3>
              <p className="text-gray-300 leading-relaxed">
                From supply systems and B2B platforms to security, analytics,
                and marketing technology — our backgrounds intersect where{" "}
                <span className="text-lime-green">
                  complexity meets opportunity
                </span>
                .
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Our Approach
              </h3>
              <p className="text-gray-300 leading-relaxed">
                We don't just ship code or pixels. We solve{" "}
                <span className="text-lime-green">
                  business-critical problems
                </span>
                : inventory movement, real-time user design, global transaction
                security, and intuitive enterprise tools.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">
                What drives us
              </h3>
            </div>
            {drives.map((drive, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-lime-green/10 border border-lime-green/20 rounded-lg flex items-center justify-center group-hover:bg-lime-green/20 transition-all duration-300">
                    <drive.icon className="w-6 h-6 text-lime-green" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    {drive.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {drive.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Statement - Visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-green/5 to-transparent rounded-xl" />
          <div className="relative bg-gray-900/50 border border-gray-700 rounded-xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="w-8 h-8 text-lime-green" />
              <h3 className="text-2xl font-bold text-white font-heading">
                Breaking Boundaries
              </h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
              We are not here to follow conventions. We are here to{" "}
              <span className="text-lime-green font-medium">
                push boundaries
              </span>{" "}
              of what software can do for businesses and the people behind them.
              In stealth today,
              <span className="text-white font-medium">
                {" "}
                building tomorrow's platforms
              </span>{" "}
              that redefine how companies work, connect, and grow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}