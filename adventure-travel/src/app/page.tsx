"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ValleyHero from "@/components/ValleyHero";
import TrustedBy from "@/components/TrustedBy";
import PopularTreksV2 from "@/components/PopularTreksV2";
import HimalayanMap from "@/components/HimalayanMap";
import SplitSections from "@/components/SplitSections";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import CallToActionV2 from "@/components/CallToActionV2";
import FooterV2 from "@/components/FooterV2";
import FeaturedAdventuresV2 from "@/components/FeaturedAdventuresV2";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SnowParticles from "@/components/SnowParticles";
import ScrollDepth from "@/components/ScrollDepth";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import MountainPass from "@/components/MountainPass";
import ElevationGauge from "@/components/ElevationGauge";

const SeasonalExplorer = dynamic(() => import("@/components/SeasonalExplorer"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-96 skeleton rounded-2xl" /></div></div>,
});
const PermitTours = dynamic(() => import("@/components/PermitTours"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
});
const TestimonialsV2 = dynamic(() => import("@/components/TestimonialsV2"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-48 skeleton rounded-2xl" /></div></div>,
});
const StatisticsV2 = dynamic(() => import("@/components/StatisticsV2"), {
  loading: () => <div className="py-section-sm bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-32 skeleton rounded-2xl" /></div></div>,
});
const AdventureStories = dynamic(() => import("@/components/AdventureStories"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
});
const InstagramGallery = dynamic(() => import("@/components/InstagramGallery"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-48 skeleton rounded-2xl" /></div></div>,
});
const FAQV2 = dynamic(() => import("@/components/FAQV2"), {
  loading: () => <div className="py-section bg-background/70 backdrop-blur-md"><div className="mx-auto max-w-7xl px-6"><div className="h-64 skeleton rounded-2xl" /></div></div>,
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
    <SmoothScrollProvider>
      <main className="relative overflow-x-hidden">
        <ScrollProgress />
        <SnowParticles />
        <ElevationGauge />
        <ValleyHero />
        <div className="relative z-10">
          <TrustedBy />
          <ScrollDepth><PopularTreksV2 /></ScrollDepth>
          <ScrollDepth depth={40} rotateX={2}><HimalayanMap /></ScrollDepth>
          <ScrollDepth><SplitSections /></ScrollDepth>
          <ScrollDepth depth={30}><FeaturedDestinations /></ScrollDepth>
          <ScrollDepth><SeasonalExplorer /></ScrollDepth>
          <ScrollDepth depth={40} rotateX={2}><FeaturedAdventuresV2 /></ScrollDepth>
          <ScrollDepth><PermitTours /></ScrollDepth>
          <ScrollDepth depth={30}><AdventureStories /></ScrollDepth>
          <ScrollDepth><InstagramGallery /></ScrollDepth>
          <ScrollDepth depth={20}><StatisticsV2 /></ScrollDepth>
          <ScrollDepth><TestimonialsV2 /></ScrollDepth>
          <ScrollDepth><FAQV2 /></ScrollDepth>
          <ScrollDepth><CallToActionV2 /></ScrollDepth>
          <MountainPass />
          <FooterV2 />
        </div>
        <FloatingWhatsApp />
      </main>
    </SmoothScrollProvider>
  );
}
