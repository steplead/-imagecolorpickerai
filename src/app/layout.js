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
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 text-neutral-900`}
        suppressHydrationWarning
      >
        <Header />
        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
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
