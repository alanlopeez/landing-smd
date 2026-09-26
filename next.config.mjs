/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://googleads.g.doubleclick.net https://*.google.com https://crm.serviciodemarketingdigital.com http://localhost:3000 http://127.0.0.1:3000;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob: https://www.google.com https://www.google.com.ar https://googleads.g.doubleclick.net https://*.google-analytics.com https://*.googletagmanager.com https://*.ytimg.com https://i.ytimg.com;
  media-src 'self' data: blob: https://images.refero.design;
  connect-src 'self' https://script.google.com https://script.googleusercontent.com https://styles.refero.design https://images.refero.design https://*.vercel.app https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://googleads.g.doubleclick.net https://*.google.com https://crm.serviciodemarketingdigital.com http://localhost:3000 http://127.0.0.1:3000;
  frame-src 'self' https://styles.refero.design https://*.google.com https://www.youtube.com https://youtube.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://script.google.com https://script.googleusercontent.com;
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
