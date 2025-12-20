import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Image Color Picker - Extract Hex Codes from Images",
  description: "Upload any image to find its Traditional Chinese Color match. Extract Hex codes, RGB, and generate aesthetic wallpapers instantly.",
  // Protocol 3: No keywords tag
  alternates: {
    canonical: 'https://imagecolorpickerai.com',
  },
};

import Header from "@/components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 text-neutral-900`}
        suppressHydrationWarning
      >
        <Header />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
