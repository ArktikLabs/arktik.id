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
    // Pipeline hero photos are hotlinked from Unsplash, as its API terms require.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
  },
  // The loader reads content/ at request time on dynamic routes; declare it
  // so a refactor of the path helper can't silently drop it from the bundle.
  outputFileTracingIncludes: { '/**': ['./content/**/*.md'] },
}

export default withNextIntl(nextConfig);
