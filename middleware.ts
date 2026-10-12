import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  if (url.pathname === '/ventas' || url.pathname === '/ventas/') {
    return NextResponse.redirect(new URL('/ventas.html', request.url));
  }

  if (url.pathname === '/500' || url.pathname === '/500/') {
    return NextResponse.redirect(new URL('/500/index.html', request.url));
  }

  if (url.pathname.startsWith('/checkout') || url.pathname.startsWith('/pagar')) {
    url.pathname = '/pagar';
    return NextResponse.rewrite(url);
  }

  if (host.startsWith('500.') || host.startsWith('www.500.')) {
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/trato_garantizado.html';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
