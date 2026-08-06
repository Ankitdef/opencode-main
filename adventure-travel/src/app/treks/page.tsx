import type { Metadata } from "next";
import TreksPageClient from "./TreksPageClient";

export const metadata: Metadata = {
  title: "Trek Packages in Uttarakhand & Himachal Pradesh",
  description:
    "Browse 20+ guided Himalayan treks in Uttarakhand and Himachal Pradesh. Filter by difficulty, duration, and price. Kedarkantha, Valley of Flowers, Hampta Pass, Brahmatal and more.",
  openGraph: {
    title: "Trek Packages | Expedition Happiness Treks",
    description:
      "Browse guided Himalayan treks in Uttarakhand & Himachal Pradesh. Filter by difficulty, duration, and price.",
    url: "https://expeditionhappiness.com/treks",
  },
  alternates: {
    canonical: "https://expeditionhappiness.com/treks",
  },
};

export default function TreksPage() {
  return <TreksPageClient />;
}
