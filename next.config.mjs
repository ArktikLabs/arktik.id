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
  outputFileTracingIncludes: {
    '/**': ['./content/**/*.md'],
    '/og/**': ['./assets/fonts/*.ttf', './public/assets/logo.svg'],
  },
  // Renamed slugs keep their links and rankings via a permanent redirect.
  async redirects() {
    const moved = [
      [
        'blog/digital-strategy/why-every-business-needs-a-strong-digital-presence-in-2025',
        'blog/digital-strategy/why-every-business-needs-a-strong-digital-presence',
      ],
    ];
    return moved.flatMap(([from, to]) =>
      ['', '/en'].map((prefix) => ({
        source: `${prefix}/${from}/`,
        destination: `${prefix}/${to}/`,
        permanent: true,
      })),
    );
  },
}

export default withNextIntl(nextConfig);
