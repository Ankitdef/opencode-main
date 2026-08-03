"use client";

import { useEffect, useState } from "react";
import HeroSplit from "@/components/HeroSplit";
import TrustedBy from "@/components/TrustedBy";
import PopularTreksV2 from "@/components/PopularTreksV2";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import SeasonalExplorer from "@/components/SeasonalExplorer";
import SplitSections from "@/components/SplitSections";
import FeaturedAdventuresV2 from "@/components/FeaturedAdventuresV2";
import HimalayanMap from "@/components/HimalayanMap";
import PermitTours from "@/components/PermitTours";
import TestimonialsV2 from "@/components/TestimonialsV2";
import StatisticsV2 from "@/components/StatisticsV2";
import AdventureStories from "@/components/AdventureStories";
import InstagramGallery from "@/components/InstagramGallery";
import FAQV2 from "@/components/FAQV2";
import CallToActionV2 from "@/components/CallToActionV2";
import FooterV2 from "@/components/FooterV2";

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
