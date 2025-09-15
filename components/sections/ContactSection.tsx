"use client"

import { CTAButton } from "@/components/ui/cta-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle } from "lucide-react"
import { Underline } from "@/components/ui/underline";
import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappMessage = `Hi Arktik! I'm interested in your services.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Company/Project: ${formData.company}

Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/6285117697889?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="max-w-7xl mx-auto">
      <section id="contact" className="px-6 py-20 lg:px-12">
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-heading mb-2">
              Ready to transform your idea into reality?
            </h2>
            <Underline />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mb-8">
            Let's explore how we can transform your vision into measurable
            success.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="mailto:hello@arktik.id"
              className="flex items-center gap-3 text-white hover:text-lime-green transition-colors duration-200 group"
            >
              <Mail className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span>hello@arktik.id</span>
            </a>
            <a
              href="https://wa.me/6285117697889"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-lime-green transition-colors duration-200 group"
            >
              <MessageCircle className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span>+62 851-1769-7889</span>
            </a>
          </div>
        </div>

        <div className="max-w-6xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Personal Info */}
              <div className="grid grid-rows-[auto_auto_1fr] gap-8">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div className="flex items-end">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
              </div>

              {/* Right Column - Project Info */}
              <div className="grid grid-rows-[auto_1fr] gap-8">
                <div>
                  <Input
                    type="text"
                    name="company"
                    placeholder="Company/Project name"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <Textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 resize-none px-0 pb-2 overflow-y-auto flex-grow min-h-[48px]"
                  />
                </div>
              </div>
            </div>

            {/* Button aligned right */}
            <div className="flex justify-end">
              <CTAButton type="submit" variant="small">
                Send message
              </CTAButton>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}