"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { courses } from "@/data/courses";
import TermsConditions from "@/components/TermsConditions";

// skiing course gallery upscaled to wallpaper size
const WALLPAPERS = (courses.find((c) => c.slug === "skiing-course")?.gallery ?? []).map((u) =>
  u.replace("w=800", "w=1920")
);

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Skiing: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  Snowboarding: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Backcountry: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

export default function CoursesPageClient() {
  const [wallpaper, setWallpaper] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || WALLPAPERS.length < 2) return;
    const t = setInterval(() => setWallpaper((i) => (i + 1) % WALLPAPERS.length), 5000);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {WALLPAPERS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === wallpaper ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
            AULI SNOW SPORTS ACADEMY
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
            Skiing & Snowboarding
            <br />
            <span className="text-cyan-200">in the Himalayas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Certified 7-day courses on the powder slopes of Auli. Learn from professionals with complete equipment provided.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Dec 2026 — Mar 2027
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Auli, Uttarakhand
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Certified Instructors
            </span>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading">
            Choose Your Course
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From first-timers to seasoned adventurers — structured progression tracks taught by certified mountain guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => {
            const colors = TYPE_COLORS[course.type];
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {course.featured && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} mb-3`}>
                    {course.type}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.shortDescription}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">Rs.{course.price.toLocaleString("en-IN")}</span>
                      <span className="text-sm text-gray-500 ml-1">/ person</span>
                    </div>
                    <span className="text-sky-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Course
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
              Why Learn With Us
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🎯", title: "Certified Instructors", desc: "Professional coaches with international certifications" },
              { icon: "🏔️", title: "Prime Location", desc: "Auli's 2,800m slopes with Nanda Devi views" },
              { icon: "🎿", title: "All Equipment", desc: "Complete gear provided — no need to bring anything" },
              { icon: "📜", title: "Recognized Certification", desc: "Course completion certificate for your portfolio" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-sky-600 to-cyan-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
            Ready to Hit the Slopes?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Book your 7-day course today and learn to ski or snowboard in the Himalayas.
          </p>
          <a
            href="https://wa.me/917817912062?text=Hi!%20I'm%20interested%20in%20the%20skiing/snowboarding%20course%20in%20Auli."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-sky-50 transition-colors"
          >
            Book on WhatsApp
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <TermsConditions />
        </div>
      </section>
    </div>
  );
}
