import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us — Plan Your Himalayan Trek",
  description:
    "Get in touch with Expedition Happiness Treks. Plan your guided Himalayan trek in Uttarakhand or Himachal Pradesh. WhatsApp, email, or call our trek experts.",
  openGraph: {
    title: "Contact Us | Expedition Happiness Treks",
    description:
      "Plan your guided Himalayan trek. WhatsApp, email, or call our trek experts.",
    url: "https://expeditionhappiness.com/contact",
  },
  alternates: {
    canonical: "https://expeditionhappiness.com/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
