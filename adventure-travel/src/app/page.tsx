"use client";

import dynamic from "next/dynamic";
import SeasonSplitHero from "@/components/SeasonSplitHero";
import StatsStrip from "@/components/StatsStrip";
import SummerTreksRail from "@/components/SummerTreksRail";
import SnowSchool from "@/components/SnowSchool";
import TheRange from "@/components/TheRange";
import StoriesTestimonials from "@/components/StoriesTestimonials";
import CallToActionV2 from "@/components/CallToActionV2";
import FooterV2 from "@/components/FooterV2";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import MobileSearchButton from "@/components/MobileSearchButton";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const FAQV2 = dynamic(() => import("@/components/FAQV2"), {
  loading: () => (
    <div className="py-section bg-background/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-64 skeleton rounded-2xl" />
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative overflow-x-hidden">
        <SeasonSplitHero />
        <div className="relative z-10">
          <StatsStrip />
          <SummerTreksRail />
          <SnowSchool />
          <TheRange />
          <StoriesTestimonials />
          <FAQV2 />
          <CallToActionV2 />
          <FooterV2 />
        </div>
        <FloatingWhatsApp />
        <MobileSearchButton />
      </main>
    </SmoothScrollProvider>
  );
}
