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
  title: "ManahumanizeAI — Transform AI Writing into Natural Human Prose",
  description:
    "All-in-one AI writing suite. Humanize AI text, detect AI content with sentence-level transparency, paraphrase, enhance grammar, and generate compelling articles.",
  keywords: [
    "ManahumanizeAI",
    "AI Humanizer",
    "Natural Writing Assistant",
    "AI Detector",
    "Paraphraser",
    "Grammar Checker",
    "AI Writer",
    "Make AI Sound Human",
    "Text Rewriter",
  ],
  authors: [{ name: "ManahumanizeAI Team" }],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },

  openGraph: {
    title: "ManahumanizeAI — Transform AI Writing into Natural Human Prose",
    description:
      "Transform rigid AI-generated text into clear, natural, engaging writing while preserving original meaning. Advanced AI detector and paraphrasing suite.",
    url: "/",
    siteName: "ManahumanizeAI",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "ManahumanizeAI Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManahumanizeAI — Transform AI Writing into Natural Human Prose",
    description: "Transform AI text into clear, human-quality writing. Advanced detection, paraphraser & grammar.",
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
