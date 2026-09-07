import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "HumanizeAI — Make AI Writing Sound Naturally Yours",
  description:
    "All-in-one AI writing suite. Humanize AI text, detect AI content with sentence-level transparency, paraphrase, enhance grammar, and generate compelling articles.",
  keywords: [
    "AI Humanizer",
    "Bypass AI Detection",
    "AI Detector",
    "Paraphraser",
    "Grammar Checker",
    "AI Writer",
    "Make AI Sound Human",
    "Text Rewriter",
  ],
  authors: [{ name: "HumanizeAI Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "HumanizeAI — Make AI Writing Sound Naturally Yours",
    description:
      "Transform rigid AI-generated text into clear, natural, engaging writing while preserving original meaning. Advanced AI detector and paraphrasing suite.",
    url: "/",
    siteName: "HumanizeAI",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "HumanizeAI Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HumanizeAI — Make AI Writing Sound Naturally Yours",
    description: "Transform AI text into clear, human-quality writing. Advanced detection, paraphraser & grammar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: "#0B0F19", colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `html, body { background-color: #0B0F19 !important; color-scheme: dark !important; color: #F8FAFC !important; }`,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-[#0B0F19] text-foreground`}
        style={{ backgroundColor: "#0B0F19" }}
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
