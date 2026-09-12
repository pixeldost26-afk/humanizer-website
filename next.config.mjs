/** @type {import('next').NextConfig} */

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://images.unsplash.com https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
  "connect-src 'self' https://api.openai.com https://api.groq.com https://api.stripe.com https://api.razorpay.com https://lh3.googleusercontent.com https://accounts.google.com",
  "frame-ancestors 'none'",
  "form-action 'self' https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/humanizer',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/humanizer',
        permanent: true,
      },
      {
        source: '/forgot-password',
        destination: '/humanizer',
        permanent: true,
      },
      {
        source: '/reset-password',
        destination: '/humanizer',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/((?!sitemap\\.xml|robots\\.txt).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
