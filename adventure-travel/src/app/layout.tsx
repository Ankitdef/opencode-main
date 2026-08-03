import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Expedition Happiness Treks | Premium Himalayan Adventures in Uttarakhand & Himachal",
    template: "%s | Expedition Happiness Treks",
  },
  description:
    "Book guided Himalayan treks in Uttarakhand and Himachal Pradesh. Certified trek leaders, small groups, safety-first approach. Kedarkantha, Valley of Flowers, Hampta Pass, Brahmatal and more.",
  keywords: [
    "Himalayan trekking",
    "Uttarakhand treks",
    "Himachal treks",
    "Kedarkantha trek",
    "Valley of Flowers",
    "Brahmatal trek",
    "Hampta Pass",
    "guided treks India",
    "snow treks",
    "winter trekking",
    "mountain camping",
    "adventure travel Uttarakhand",
    "Himalayan expedition",
    "Beginner treks India",
    "high altitude trekking",
  ],
  authors: [{ name: "Expedition Happiness" }],
  creator: "Expedition Happiness",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://expeditionhappiness.com",
    siteName: "Expedition Happiness Treks",
    title: "Expedition Happiness Treks | Premium Himalayan Adventures",
    description:
      "Explore the Himalayas with certified guides, small groups, and unforgettable experiences. Treks in Uttarakhand & Himachal Pradesh.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Himalayan mountain trek view",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expedition Happiness Treks | Himalayan Adventures",
    description:
      "Certified guides, small groups, and epic Himalayan treks. Book Kedarkantha, Valley of Flowers, Hampta Pass and more.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"],
    creator: "@ExpeditionHappiness",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Preloader />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
