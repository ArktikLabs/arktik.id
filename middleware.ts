import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import path from "path";

const intlMiddleware = createMiddleware({
  ...routing,
  // Don't use a prefix for the default locale
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Handle /portfolio redirect
  if (
    pathname === "/portfolio" ||
    pathname.startsWith("/portfolio/") ||
    pathname === "/portofolio" ||
    pathname.startsWith("/portofolio/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.hash = "portfolio";
    // Preserve existing query parameters
    url.search = search;
    return NextResponse.redirect(url);
  }

  // Handle locale-prefixed /portfolio or /portofolio redirect (e.g., /en/portfolio)
  if (pathname.match(/^\/(en|id)\/portfolio(\/.*)?$/) || pathname.match(/^\/(en|id)\/portofolio(\/.*)?$/)) {
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
  // Match all routes except API routes, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon\\.ico|favicon\\.png|favicon\\.svg|robots.txt|sitemap.xml).*)'
  ]
};