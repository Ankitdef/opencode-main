"use client";

import Link from "next/link";
import { treks } from "@/data/treks";
import SmartImage from "./SmartImage";
import { FadeUp, StaggerContainer, StaggerItem } from "./MotionWrapper";

const permitTours = treks.filter((t) => t.permitTour);

const perks = [
  {
    title: "Inner Line Permits Handled",
    desc: "We process your mandatory ILP with the Chamoli district administration (SDM / DM office), including the police & health verification.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    title: "Local Guide Community",
    desc: "Licensed guides from the frontier villages — Niti, Gamsali and Mana — who know every trail, checkpoint and weather window.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "4×4 Vehicle Support",
    desc: "Private Himalayan-grade vehicles to the last motorable point and back along the Malari highway — driver and fuel included.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Frontier-Zone Expertise",
    desc: "Deep experience in restricted India–Tibet zones, where final access always depends on weather and army clearance.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
];

export default function PermitTours() {
  if (permitTours.length === 0) return null;

  return (
    <section id="permit-tours" className="py-section bg-gradient-to-b from-background/70 via-background/40 to-primary/5 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeUp className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Restricted Frontier Zones
          </span>
          <h2 className="mt-4 font-heading text-2xl sm:text-3xl md:text-display-lg font-bold text-foreground leading-tight">
            Inner Line Permit Tours
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            Some of the Himalayas&apos; most remote places sit inside India&apos;s protected border belt near Tibet —
            you cannot simply walk in. These are <span className="text-foreground font-semibold">permit-facilitated tours</span>,
            not open treks: we arrange your Inner Line Permit, licensed local guides, and 4×4 transport so all you do is show up.
          </p>
        </FadeUp>

        {/* Value props */}
        <StaggerContainer className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" staggerDelay={0.08}>
          {perks.map((perk) => (
            <StaggerItem key={perk.title}>
              <div className="h-full glass-card rounded-2xl p-6 hover-glow">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  {perk.icon}
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{perk.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{perk.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tour cards */}
        <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.1}>
          {permitTours.map((tour) => (
            <StaggerItem key={tour.id}>
              <Link
                href={`/treks/${tour.slug}`}
                className="group card-premium block rounded-2xl overflow-hidden bg-card border border-gray-100 dark:border-white/10 shadow-lg shadow-black/5 h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <SmartImage
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover card-img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ILP Permit
                  </span>
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-white/80 text-xs">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {tour.location || tour.region}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white leading-tight">{tour.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-muted line-clamp-2">{tour.blurb}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {tour.maxAltitude.toLocaleString()}m
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tour.days} Days
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 013 17.208V17c0-2.071 1.456-3.818 3.382-4.262" />
                      </svg>
                      Max {tour.groupSize}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4">
                    <span className="text-lg font-bold text-accent">
                      {tour.currency}{tour.price.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-muted ml-1">/ person</span>
                    </span>
                    <span className="text-xs font-semibold text-primary trek-card-arrow inline-flex items-center gap-1">
                      Details
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Compliance note + CTA */}
        <FadeUp className="mt-10">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Good to know
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Permits are issued by the Chamoli district administration and require police &amp; health verification —
                we handle the paperwork, but final access to any frontier zone always depends on weather and army clearance.
                Share your dates early so we can secure clearances in time.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
            >
              Plan a Permit Tour
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
