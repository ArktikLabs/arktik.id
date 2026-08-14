import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: false, // Disable Next.js compression to avoid double compression with CDN
  images: {
    // Contentful asset CDN — blog/case-study featured images now render through
    // next/image (they used to be inline CSS background-images), so the host
    // has to be allowlisted for the optimiser.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig);
