import type { Metadata } from "next";
import CoursesPageClient from "./CoursesPageClient";

export const metadata: Metadata = {
  title: "Skiing & Snowboarding Courses in Auli | Expedition Happiness Treks",
  description:
    "Book certified 7-day skiing, snowboarding, and backcountry touring courses in Auli, Uttarakhand. All equipment, accommodation, and meals included. From Rs.30,000 per person.",
  openGraph: {
    title: "Skiing & Snowboarding Courses | Expedition Happiness Treks",
    description:
      "Certified 7-day skiing, snowboarding, and backcountry courses in Auli, Uttarakhand. All-inclusive packages from Rs.30,000.",
    url: "https://expeditionhappiness.com/courses",
  },
  alternates: {
    canonical: "https://expeditionhappiness.com/courses",
  },
};

export default function CoursesPage() {
  return <CoursesPageClient />;
}
