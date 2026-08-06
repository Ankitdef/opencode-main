import type { Metadata } from "next";
import CancellationPolicyPageClient from "./CancellationPolicyPageClient";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "Transparent cancellation and refund policy for Himalayan trek bookings. Understand refund tiers, rescheduling options, and no-show scenarios.",
  openGraph: {
    title: "Cancellation & Refund Policy | Expedition Happiness Treks",
    description:
      "Transparent cancellation and refund policy for trek bookings.",
    url: "https://expeditionhappiness.com/cancellation-policy",
  },
  alternates: {
    canonical: "https://expeditionhappiness.com/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return <CancellationPolicyPageClient />;
}
