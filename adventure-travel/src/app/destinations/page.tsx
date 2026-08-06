import type { Metadata } from "next";
import DestinationsPageClient from "./DestinationsPageClient";

export const metadata: Metadata = {
  title: "Destinations — Himalayan Trekking Regions",
  description:
    "Explore trekking destinations across Uttarakhand and Himachal Pradesh. From the Valley of Flowers to Hampta Pass, find your perfect Himalayan adventure.",
  openGraph: {
    title: "Destinations | Expedition Happiness Treks",
    description:
      "Explore trekking destinations across Uttarakhand and Himachal Pradesh.",
    url: "https://expeditionhappiness.com/destinations",
  },
  alternates: {
    canonical: "https://expeditionhappiness.com/destinations",
  },
};

export default function DestinationsPage() {
  return <DestinationsPageClient />;
}
