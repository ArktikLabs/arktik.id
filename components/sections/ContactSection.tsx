"use client"

import { CTAButton } from "@/components/ui/cta-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageCircle } from "lucide-react"
import { Underline } from "@/components/ui/underline";
import { useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useTranslations, useLocale } from "next-intl";

export function ContactSection() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [leadStarted, setLeadStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fire lead_form_start once on first meaningful input
    if (!leadStarted && value.trim().length > 3) {
      const startedKey = "lead_form_started_contact";
      try {
        const already =
          typeof window !== "undefined" &&
          window.sessionStorage.getItem(startedKey) === "1";
        if (!already) {
          setLeadStarted(true);
          window.sessionStorage.setItem(startedKey, "1");
          sendGTMEvent({ event: "lead_form_start", form: "contact", locale });
        }
      } catch {
        // sessionStorage might be unavailable; still send event once
        setLeadStarted(true);
        sendGTMEvent({ event: "lead_form_start", form: "contact", locale });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const hasContent = [
      formData.name,
      formData.email,
      formData.phone,
      formData.company,
      formData.message,
    ].some((v) => v.trim().length > 0);

    if (!hasContent) {
      // Ask confirmation only if the form is essentially empty
      setConfirmOpen(true);
      return;
    }
    // If the user filled something, proceed without extra friction
    handleConfirm({ isModal: false });
  };

  const buildWhatsappMessage = () => {
    return `${t('whatsapp.greeting')}

${t('whatsapp.nameLabel')}: ${formData.name}
${t('whatsapp.emailLabel')}: ${formData.email}
${t('whatsapp.phoneLabel')}: ${formData.phone}
${t('whatsapp.companyLabel')}: ${formData.company}

${t('whatsapp.messageLabel')}: ${formData.message}`;
  };

  const handleConfirm = ({ isModal = false }) => {
    if (isSubmitting) return;
    const whatsappMessage = buildWhatsappMessage();
    const whatsappUrl = `https://wa.me/6285117697889?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    // First-party capture (no PII to GA): fire-and-forget
    try {
      const eventId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : undefined;
      const payload = {
        ...formData,
        source: "contact_whatsapp",
        page:
          typeof window !== "undefined" ? window.location.pathname : undefined,
        referrer:
          typeof document !== "undefined" ? document.referrer : undefined,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        eventId,
      };
      const json = JSON.stringify(payload);
      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([json], { type: "application/json" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigator as any).sendBeacon("/api/leads", blob);
      } else {
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
          keepalive: true,
        }).catch(() => {});
      }

      // Track confirmed lead (no value/currency)
      sendGTMEvent({
        event: `generate_lead${isModal ? "_modal" : ""}`,
        method: "whatsapp",
        form: "contact",
        cta: "send_message",
        label: "contact_form_whatsapp",
        event_id: eventId,
        locale,
      });
    } catch {
      // no-op
    }

    setIsSubmitting(true);
    setConfirmOpen(false);
    window.open(whatsappUrl, "_blank");
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    sendGTMEvent({
      event: "lead_cancel",
      method: "whatsapp",
      form: "contact",
      label: "confirm_cancel",
      locale,
    });
  };

  // Removed focus-based starter; now handled in handleInputChange
  return (
    <div className="max-w-7xl mx-auto">
      <section id="contact" className="px-6 py-20 lg:px-12">
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white font-heading mb-2">
              {t('title')}
            </h2>
            <Underline />
          </div>
          <p className="text-gray-400 text-lg mb-8">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="mailto:hello@arktik.id"
              className="flex items-center gap-3 text-white hover:text-lime-green transition-colors duration-200 group"
              onClick={() =>
                sendGTMEvent({
                  event: "contact_click_email",
                  locale,
                })
              }
            >
              <Mail className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span className="contact_email_link">hello@arktik.id</span>
            </a>
            <a
              href="https://wa.me/6285117697889"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white hover:text-lime-green transition-colors duration-200 group"
              onClick={() =>
                sendGTMEvent({
                  event: "contact_click_whatsapp",
                  locale,
                })
              }
            >
              <MessageCircle className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span className="contact_whatsapp_link">+62 851-1769-7889</span>
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
                    placeholder={t('form.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('form.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div className="flex items-end">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder={t('form.phonePlaceholder')}
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
                    placeholder={t('form.companyPlaceholder')}
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 px-0 pb-2"
                  />
                </div>
                <div className="flex flex-col">
                  <Textarea
                    name="message"
                    placeholder={t('form.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-transparent border-0 border-b-2 border-gray-600 rounded-none text-white placeholder:text-gray-400 focus:border-lime-green focus:ring-0 resize-none px-0 pb-2 overflow-y-auto flex-grow min-h-[48px]"
                  />
                </div>
              </div>
            </div>

            {/* Button aligned right */}
            <div className="flex justify-end">
              <CTAButton
                type="submit"
                variant="small"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                className="generate_lead_cta"
              >
                {t('form.sendButton')}
              </CTAButton>
            </div>
          </form>
        </div>

        <ConfirmModal
          open={confirmOpen}
          onCancel={handleCancel}
          onConfirm={() => handleConfirm({ isModal: true })}
          confirmDisabled={isSubmitting}
          title={t('modal.title')}
          description={t('modal.description')}
          confirmText={isSubmitting ? t('modal.confirmingText') : t('modal.confirmText')}
        >
          {buildWhatsappMessage()}
        </ConfirmModal>
      </section>
    </div>
  );
}
