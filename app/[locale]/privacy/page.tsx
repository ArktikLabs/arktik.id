/* Privacy policy, /privacy (id) and /en/privacy. Written for UU PDP (UU 27/2022) and, for visitors in the EU/UK, GDPR.
 * Keep it in step with what the site really does: the contact form (app/api/leads -> hooks.arktik.id -> Telegram),
 * Google Analytics via GTM behind the consent banner (components/ConsentBanner.tsx), and Vercel Web Analytics. */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/sections/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { ConsentSettingsLink } from "@/components/ConsentBanner";
import { alternatesFor } from "@/lib/seo/schema";

type Props = { params: Promise<{ locale: string }> };

const UPDATED = { id: "28 September 2026", en: "28 September 2026" };

const CONTROLLER = {
  name: "PT Bahtera Solusi Digital",
  address:
    "Cengkareng Business City, Lot 12 Unit 18-19 Lantai 1, Jalan Atang Sanjaya Nomor 21, Kelurahan Benda, Kecamatan Benda, Kota Tangerang, Banten 15125, Indonesia",
  email: "hello@arktik.id",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const id = locale === "id";
  return {
    title: id ? "Kebijakan privasi · Arktik" : "Privacy policy · Arktik",
    description: id
      ? "Data apa yang dikumpulkan situs Arktik, untuk apa, berapa lama disimpan, dan hak Anda."
      : "What the Arktik website collects, why, how long it is kept, and your rights.",
    alternates: alternatesFor(locale, "privacy"),
  };
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-6 font-heading text-xl font-bold text-ink">{children}</h2>;
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const id = locale === "id";
  const mail = (
    <a href={`mailto:${CONTROLLER.email}`} className="text-lime-green underline underline-offset-4">
      {CONTROLLER.email}
    </a>
  );
  const settings = (
    <ConsentSettingsLink className="text-lime-green underline underline-offset-4" />
  );

  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-12">
        <article className="space-y-4 leading-relaxed text-ink-2 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
          <h1 className="font-heading text-3xl font-bold text-ink lg:text-4xl">
            {id ? "Kebijakan privasi" : "Privacy policy"}
          </h1>
          <p className="label-mono">
            {id ? "Berlaku sejak" : "Effective"} {id ? UPDATED.id : UPDATED.en}
          </p>

          {id ? (
            <>
              <H>Siapa kami</H>
              <p>
                Situs www.arktik.id dikelola oleh <strong>{CONTROLLER.name}</strong> (&quot;Arktik&quot;, &quot;kami&quot;),{" "}
                {CONTROLLER.address}. Kami adalah pengendali data pribadi yang dikumpulkan lewat situs ini. Pertanyaan soal
                privasi: {mail}.
              </p>

              <H>Data yang kami kumpulkan</H>
              <ul className="space-y-2">
                <li>
                  <strong>Formulir kontak:</strong> nama, email, nomor telepon dan nama perusahaan (opsional), isi pesan,
                  bahasa dan halaman tempat Anda mengisi formulir, situs asal, jenis browser, dan alamat IP (untuk mencegah
                  spam).
                </li>
                <li>
                  <strong>Jika Anda menghubungi kami lewat email atau WhatsApp:</strong> apa pun yang Anda kirim di sana.
                </li>
                <li>
                  <strong>Statistik kunjungan:</strong> lihat bagian Cookie di bawah.
                </li>
              </ul>

              <H>Untuk apa, dan dasar hukumnya</H>
              <ul className="space-y-2">
                <li>
                  Membalas pesan Anda dan membahas proyek yang Anda tanyakan. Dasarnya: permintaan Anda sendiri, dan
                  langkah sebelum kemungkinan kontrak.
                </li>
                <li>Mencegah spam dan penyalahgunaan formulir. Dasarnya: kepentingan sah kami menjaga layanan.</li>
                <li>
                  Memahami kunjungan dan mengukur iklan kami (Google Analytics), hanya jika Anda menyetujuinya.
                </li>
              </ul>
              <p>
                Kami tidak menjual data Anda, tidak mendaftarkan Anda ke newsletter, dan tidak mengirim email otomatis.
              </p>

              <H>Cookie</H>
              <ul className="space-y-2">
                <li>
                  <strong>Google Analytics</strong> (lewat Google Tag Manager) memasang cookie{" "}
                  <code className="font-mono">_ga</code> dan <code className="font-mono">_ga_*</code> untuk menghitung
                  kunjungan, serta <code className="font-mono">_gcl_au</code> untuk mengukur hasil iklan Google kami. Cookie ini <strong>hanya dipasang jika Anda menekan
                  &quot;Terima&quot;</strong> di banner cookie, berlaku hingga 2 tahun. Jika Anda menolak, Google hanya
                  menerima sinyal tanpa cookie dan tanpa ID pengunjung (Google Consent Mode).
                </li>
                <li>
                  <strong>Vercel Web Analytics</strong> menghitung kunjungan halaman tanpa cookie dan tanpa menyimpan data
                  yang mengenali Anda.
                </li>
                <li>
                  Pilihan Anda di banner disimpan di browser Anda (localStorage) selama 6 bulan. Anda bisa mengubahnya kapan
                  saja: {settings}.
                </li>
              </ul>

              <H>Siapa lagi yang memproses data</H>
              <ul className="space-y-2">
                <li>Vercel Inc. (Amerika Serikat): hosting situs.</li>
                <li>
                  Tencent Cloud (Singapura): server Arktik tempat pesan formulir kontak disimpan.
                </li>
                <li>Telegram: pemberitahuan pesan baru ke tim kami.</li>
                <li>Google LLC: Google Analytics dan Tag Manager, hanya dengan persetujuan Anda.</li>
              </ul>
              <p>
                Karena itu data Anda bisa diproses di luar Indonesia. Kami hanya memakai penyedia yang menerapkan pengamanan
                data yang setara.
              </p>

              <H>Berapa lama disimpan</H>
              <p>
                Pesan formulir kontak kami simpan paling lama 24 bulan sejak kontak terakhir, lalu dihapus, kecuali Anda
                menjadi klien (data proyek diatur dalam kontrak). Data Google Analytics disimpan paling lama 14 bulan.
              </p>

              <H>Hak Anda</H>
              <p>
                Sesuai UU Pelindungan Data Pribadi (UU 27/2022), dan GDPR bagi Anda yang berada di Uni Eropa atau Inggris,
                Anda berhak meminta salinan data Anda, membetulkannya, menghapusnya, membatasi atau menolak pemrosesannya,
                dan menarik persetujuan kapan saja. Kirim permintaan ke {mail}; kami menjawab paling lambat 3 x 24 jam hari
                kerja. Anda juga berhak mengadu ke otoritas pelindungan data.
              </p>

              <H>Keamanan</H>
              <p>
                Koneksi memakai HTTPS, akses ke data dibatasi pada tim yang menangani pesan Anda. Jika terjadi kebocoran yang
                menyangkut data Anda, kami memberi tahu Anda paling lambat 3 x 24 jam setelah mengetahuinya.
              </p>

              <H>Perubahan</H>
              <p>Kebijakan ini bisa berubah. Versi terbaru selalu ada di halaman ini, dengan tanggal berlakunya.</p>
            </>
          ) : (
            <>
              <H>Who we are</H>
              <p>
                www.arktik.id is run by <strong>{CONTROLLER.name}</strong> (&quot;Arktik&quot;, &quot;we&quot;),{" "}
                {CONTROLLER.address}. We are the controller of the personal data collected through this site. Privacy
                questions: {mail}.
              </p>

              <H>What we collect</H>
              <ul className="space-y-2">
                <li>
                  <strong>Contact form:</strong> your name, email, phone number and company name (optional), your message,
                  the language and page you used, the referring site, your browser type, and your IP address (to prevent
                  spam).
                </li>
                <li>
                  <strong>If you email or WhatsApp us:</strong> whatever you send there.
                </li>
                <li>
                  <strong>Visit statistics:</strong> see Cookies below.
                </li>
              </ul>

              <H>Why, and on what basis</H>
              <ul className="space-y-2">
                <li>
                  To answer your message and discuss the project you asked about. Basis: your own request, and steps
                  before a possible contract.
                </li>
                <li>To stop spam and abuse of the form. Basis: our legitimate interest in keeping the service usable.</li>
                <li>To understand visits and measure our ads (Google Analytics), only if you consent.</li>
              </ul>
              <p>We don&apos;t sell your data, don&apos;t add you to a newsletter, and don&apos;t send automated emails.</p>

              <H>Cookies</H>
              <ul className="space-y-2">
                <li>
                  <strong>Google Analytics</strong> (via Google Tag Manager) sets the <code className="font-mono">_ga</code>{" "}
                  and <code className="font-mono">_ga_*</code> cookies to count visits, and{" "}
                  <code className="font-mono">_gcl_au</code> to measure our Google ads. They are{" "}
                  <strong>only set if you press &quot;Accept&quot;</strong> in the cookie banner, and last up to 2 years.
                  If you decline, Google receives only cookieless signals with no visitor ID (Google Consent Mode).
                </li>
                <li>
                  <strong>Vercel Web Analytics</strong> counts page views without cookies and without storing anything
                  that identifies you.
                </li>
                <li>
                  Your banner choice is stored in your browser (localStorage) for 6 months. Change it any time:{" "}
                  {settings}.
                </li>
              </ul>

              <H>Who else processes data</H>
              <ul className="space-y-2">
                <li>Vercel Inc. (United States): website hosting.</li>
                <li>Tencent Cloud (Singapore): Arktik&apos;s server, where contact-form messages are stored.</li>
                <li>Telegram: new-message notifications to our team.</li>
                <li>Google LLC: Google Analytics and Tag Manager, only with your consent.</li>
              </ul>
              <p>
                Your data may therefore be processed outside Indonesia. We only use providers that apply equivalent data
                protection safeguards.
              </p>

              <H>How long we keep it</H>
              <p>
                Contact-form messages are kept for up to 24 months after our last contact and then deleted, unless you
                become a client (project data is then covered by the contract). Google Analytics data is kept for at most
                14 months.
              </p>

              <H>Your rights</H>
              <p>
                Under Indonesia&apos;s Personal Data Protection Law (UU 27/2022), and the GDPR if you are in the EU or UK,
                you can ask for a copy of your data, correct it, delete it, restrict or object to its processing, and
                withdraw consent at any time. Send requests to {mail}; we reply within 3 business days. You can also
                complain to a data protection authority.
              </p>

              <H>Security</H>
              <p>
                Connections use HTTPS and access is limited to the people handling your message. If a breach affects your
                data, we tell you within 72 hours of finding out.
              </p>

              <H>Changes</H>
              <p>This policy may change. The current version, with its effective date, is always on this page.</p>
            </>
          )}
        </article>
      </main>
      <FooterSection />
    </>
  );
}
