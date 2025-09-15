import { WorkCard } from "@/components/cards/WorkCard";
import { Underline } from "@/components/ui/underline";

export function WorksSection() {
  const works = [
    {
      title: "Lenggah",
      href: "https://lenggah.com",
      imageSrc: "/portofolio/lenggah.webp",
      isImageCard: true,
    },
    {
      title: "Mata Screen Print",
      href: "https://matascreenprint.com",
      imageSrc: "/portofolio/matascreenprint.webp",
      isImageCard: true,
    },
    {
      title: "This Could Be Yours",
      href: "#contact",
      description:
        "Your idea deserves better execution. Let's transform it into custom software that drives real growth. From concept to launch, we'll build your success story.",
      buttonText: "Get Started",
      isImageCard: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <section id="portfolio" className="px-6 pt-20 pb-0 lg:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Our Works</h2>
          <Underline />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {works.map((work, index) => (
            <WorkCard
              key={index}
              title={work.title}
              href={work.href}
              imageSrc={work.imageSrc}
              description={work.description}
              buttonText={work.buttonText}
              isImageCard={work.isImageCard}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
