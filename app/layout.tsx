import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { getSiteUrl } from "@/lib/config/site";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ManaHumanizeAI – AI Text Humanizer",
  description: "Transform AI-generated text into natural human writing with ManaHumanizeAI.",
  keywords: [
    "ManaHumanizeAI",
    "AI Text Humanizer",
    "AI Humanizer",
    "Natural Writing Assistant",
    "AI Detector",
    "Paraphraser",
    "Grammar Checker",
    "AI Writer",
    "Make AI Sound Human",
    "Text Rewriter",
  ],
  authors: [{ name: "ManaHumanizeAI Team" }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "ManaHumanizeAI – AI Text Humanizer",
    description: "Transform AI-generated text into natural human writing with ManaHumanizeAI.",
    url: "/",
    siteName: "ManaHumanizeAI",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "ManaHumanizeAI Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManaHumanizeAI – AI Text Humanizer",
    description: "Transform AI-generated text into natural human writing with ManaHumanizeAI.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('humanize-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)||(!t);if(t==='light')d=false;var el=document.documentElement;if(d){el.classList.add('dark');el.classList.remove('light');el.style.colorScheme='dark';}else{el.classList.remove('dark');el.classList.add('light');el.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: `${siteUrl}/`,
                  name: "ManaHumanizeAI",
                  description: "Transform AI-generated text into natural human writing with ManaHumanizeAI.",
                  inLanguage: "en-US",
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${siteUrl}/#software`,
                  name: "ManaHumanizeAI",
                  url: `${siteUrl}/`,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "All",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
