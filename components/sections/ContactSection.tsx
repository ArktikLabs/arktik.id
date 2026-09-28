"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [leadStarted, setLeadStarted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

  // The form is sent from the site itself (stored on Arktik's server, team notified on Telegram). WhatsApp is
  // offered afterwards as an optional faster channel instead of being the only path, so no lead depends on the
  // visitor pressing send inside another app.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : undefined;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website,
          eventId,
          locale,
          page: window.location.pathname,
          referrer: document.referrer,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(
          t(
            body.error === "invalid"
              ? "form.errorInvalid"
              : body.error === "rate_limited"
                ? "form.errorRate"
                : "form.errorSend",
          ),
        );
        setStatus("error");
        return;
      }
      // Track confirmed lead (no PII, no value/currency)
      sendGTMEvent({
        event: "generate_lead",
        method: "form",
        form: "contact",
        cta: "send_message",
        label: "contact_form",
        event_id: eventId,
        locale,
      });
      setStatus("sent");
    } catch {
      setError(t("form.errorSend"));
      setStatus("error");
    }
  };

  const whatsappUrl = `https://wa.me/6285117697889?text=${encodeURIComponent(
    `${t("whatsapp.greeting")}\n\n${t("whatsapp.nameLabel")}: ${formData.name}\n${t(
      "whatsapp.messageLabel",
    )}: ${formData.message}`,
  )}`;

  // Removed focus-based starter; now handled in handleInputChange
  return (
    <div className="mx-auto max-w-7xl">
      <section id="contact" className="px-6 pb-24 pt-16 lg:px-12 lg:pb-28">
        <div className="mb-12">
          <div className="section-head mb-6">
            <h2 className="font-heading text-3xl font-bold text-ink lg:text-4xl">
              {t("title")}
            </h2>
            <span className="section-head__rule" aria-hidden="true" />
          </div>
          <p className="mb-8 text-lg text-ink-2">{t("description")}</p>

          <div className="flex flex-col gap-6 sm:flex-row">
            <a
              href="mailto:hello@arktik.id"
              className="group flex items-center gap-3 text-ink transition-colors duration-200 hover:text-lime-green"
              onClick={() =>
                sendGTMEvent({
                  event: "contact_click_email",
                  locale,
                })
              }
            >
              <Mail className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span className={`contact_email_link_${locale}`}>
                hello@arktik.id
              </span>
            </a>
            <a
              href="https://wa.me/6285117697889"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-ink transition-colors duration-200 hover:text-lime-green"
              onClick={() =>
                sendGTMEvent({
                  event: "contact_click_whatsapp",
                  locale,
                })
              }
            >
              <MessageCircle className="w-5 h-5 text-lime-green group-hover:text-lime-green" />
              <span className={`contact_whatsapp_link_${locale}`}>
                +62 851-1769-7889
              </span>
            </a>
          </div>
        </div>

        <div className="max-w-6xl">
          {status === "sent" ? (
            <div role="status" className="max-w-2xl space-y-4 border-l-2 border-lime-green pl-6">
              <p className="font-heading text-2xl font-bold text-ink">{t("sent.title")}</p>
              <p className="text-ink-2">{t("sent.body")}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendGTMEvent({ event: "contact_click_whatsapp", from: "sent", locale })}
                className="inline-flex items-center gap-2 text-sm text-lime-green underline underline-offset-4"
              >
                <MessageCircle className="h-4 w-4" /> {t("sent.whatsapp")}
              </a>
            </div>
          ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Honeypot: hidden from people and screen readers, filled by naive bots. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Personal Info */}
              <div className="grid grid-rows-[auto_auto_1fr] gap-8">
                <div>
                  {/* Real labels, visually hidden. Placeholder-as-label fails
                   * WCAG 1.3.1 / 3.3.2 — it vanishes on the first keystroke and
                   * gives autofill nothing to anchor to. */}
                  <label htmlFor="contact-name" className="sr-only">
                    {t("form.namePlaceholder")}
                  </label>
                  <Input
                    type="text"
                    id="contact-name"
                    name="name"
                    required
                    maxLength={200}
                    placeholder={`${t("form.namePlaceholder")} *`}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="rounded-none border-0 border-b-2 border-rule bg-transparent px-0 pb-2 text-ink placeholder:text-ink-3 focus-visible:border-lime-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-green"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    {t("form.emailPlaceholder")}
                  </label>
                  <Input
                    type="email"
                    id="contact-email"
                    name="email"
                    required
                    maxLength={200}
                    placeholder={`${t("form.emailPlaceholder")} *`}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-none border-0 border-b-2 border-rule bg-transparent px-0 pb-2 text-ink placeholder:text-ink-3 focus-visible:border-lime-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-green"
                  />
                </div>
                <div className="flex items-end">
                  <label htmlFor="contact-phone" className="sr-only">
                    {t("form.phonePlaceholder")}
                  </label>
                  <Input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    placeholder={t("form.phonePlaceholder")}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-none border-0 border-b-2 border-rule bg-transparent px-0 pb-2 text-ink placeholder:text-ink-3 focus-visible:border-lime-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-green"
                  />
                </div>
              </div>

              {/* Right Column - Project Info */}
              <div className="grid grid-rows-[auto_1fr] gap-8">
                <div>
                  <label htmlFor="contact-company" className="sr-only">
                    {t("form.companyPlaceholder")}
                  </label>
                  <Input
                    type="text"
                    id="contact-company"
                    name="company"
                    placeholder={t("form.companyPlaceholder")}
                    value={formData.company}
                    onChange={handleInputChange}
                    className="rounded-none border-0 border-b-2 border-rule bg-transparent px-0 pb-2 text-ink placeholder:text-ink-3 focus-visible:border-lime-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-green"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-message" className="sr-only">
                    {t("form.messagePlaceholder")}
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={5000}
                    placeholder={`${t("form.messagePlaceholder")} *`}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="min-h-[48px] flex-grow resize-none overflow-y-auto rounded-none border-0 border-b-2 border-rule bg-transparent px-0 pb-2 text-ink placeholder:text-ink-3 focus-visible:border-lime-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-green"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs text-ink-3">
                {t.rich("form.privacyNote", {
                  link: (chunks) => (
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-lime-green">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
              <CTAButton
                type="submit"
                variant="small"
                disabled={status === "sending"}
                aria-disabled={status === "sending"}
                className={`generate_lead_cta_${locale} self-end sm:self-auto`}
              >
                {status === "sending" ? t("form.sending") : t("form.sendButton")}
              </CTAButton>
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-red-400">
                {error}{" "}
                <a href="mailto:hello@arktik.id" className="underline underline-offset-4">hello@arktik.id</a>
              </p>
            )}
          </form>
          )}
        </div>

      </section>
    </div>
  );
}
