import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  // Don't use a prefix for the default locale
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Handle /portfolio redirect
  if (pathname === '/portfolio' || pathname.startsWith('/portfolio/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.hash = 'portfolio';
    // Preserve existing query parameters
    url.search = search;
    return NextResponse.redirect(url);
  }

  // Handle locale-prefixed /portfolio redirect (e.g., /en/portfolio)
  if (pathname.match(/^\/(en|id)\/portfolio(\/.*)?$/)) {
    const url = request.nextUrl.clone();
    const locale = pathname.split('/')[1];
    url.pathname = locale === 'id' ? '/' : `/${locale}/`;
    url.hash = 'portfolio';
    // Preserve existing query parameters
    url.search = search;
    return NextResponse.redirect(url);
  }

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match internationalized pathnames and portfolio routes
  matcher: ['/', '/(en|id)/:path*', '/portfolio/:path*']
};