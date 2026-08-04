"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroSplit from "@/components/HeroSplit";
import TrustedBy from "@/components/TrustedBy";
import PopularTreksV2 from "@/components/PopularTreksV2";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import SplitSections from "@/components/SplitSections";
import FeaturedAdventuresV2 from "@/components/FeaturedAdventuresV2";
import HimalayanMap from "@/components/HimalayanMap";
import CallToActionV2 from "@/components/CallToActionV2";
import FooterV2 from "@/components/FooterV2";

const SeasonalExplorer = dynamic(() => import("@/components/SeasonalExplorer"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-96 skeleton rounded-2xl" /></div></div>,
});
const PermitTours = dynamic(() => import("@/components/PermitTours"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
});
const TestimonialsV2 = dynamic(() => import("@/components/TestimonialsV2"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-48 skeleton rounded-2xl" /></div></div>,
});
const StatisticsV2 = dynamic(() => import("@/components/StatisticsV2"), {
  loading: () => <div className="py-section-sm bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-32 skeleton rounded-2xl" /></div></div>,
});
const AdventureStories = dynamic(() => import("@/components/AdventureStories"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
});
const InstagramGallery = dynamic(() => import("@/components/InstagramGallery"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-48 skeleton rounded-2xl" /></div></div>,
});
const FAQV2 = dynamic(() => import("@/components/FAQV2"), {
  loading: () => <div className="py-section bg-background"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
});

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-accent origin-left z-[60]"
      style={{ width: `${progress}%` }}
    />
  );
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden">
      <ScrollProgress />
      <HeroSplit />
      <SplitSections />
      <HimalayanMap />
      <PopularTreksV2 />
      <FeaturedDestinations />
      <SeasonalExplorer />
      <FeaturedAdventuresV2 />
      <PermitTours />
      <AdventureStories />
      <InstagramGallery />
      <FAQV2 />
      <CallToActionV2 />
      <TestimonialsV2 />
      <StatisticsV2 />
      <TrustedBy />
      <FooterV2 />
    </main>
  );
}
