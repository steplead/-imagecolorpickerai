import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://imagecolorpickerai.com'),
  title: "Image Color Picker - Professional Hex Code Extraction | ImageColorPickerAI",
  description: "Free online Image Color Picker. Extract precise Hex codes, RGB, and discover Traditional Chinese & Japanese color palettes instantly. No sign-up required.",
  openGraph: {
    title: "Image Color Picker AI - Traditional Color Encyclopedia",
    description: "Extract precise hex codes and cultural history from any image using AI.",
    url: "https://imagecolorpickerai.com",
    siteName: "ImageColorPickerAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image Color Picker AI Tool Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Color Picker AI",
    description: "AI-powered color extraction and cultural mapping.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'zh': '/zh',
      'ja': '/ja',
      'es': '/es',
      'fr': '/fr',
      'de': '/de',
      'pt': '/pt',
    },
  },
  appleWebApp: {
    title: 'ColorPicker',
    statusBarStyle: 'default',
  },
  applicationName: 'ColorPicker',
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FryingBeansFooter from '@/components/FryingBeansFooter';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 text-neutral-900`}
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-grow pt-24 pb-12">
          {children}
        </main>

        {/* Protocol 5: Internal Link Circulation */}
        <FryingBeansFooter />

        <Footer />

        {/* AdSense Auto Ads - Replace with real ID when approved */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3SWWDX8EVF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3SWWDX8EVF');
          `}
        </Script>
      </body>
    </html>
  );
}
