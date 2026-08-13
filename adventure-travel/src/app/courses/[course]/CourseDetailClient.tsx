"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createActivityBooking } from "@/lib/auth";
import type { Course } from "@/data/courses";

type Tab = "overview" | "dates" | "itinerary" | "gallery" | "included" | "book";

const TAB_LIST: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "dates", label: "Dates" },
  { key: "itinerary", label: "Itinerary" },
  { key: "gallery", label: "Photo Gallery" },
  { key: "included", label: "What's Included" },
  { key: "book", label: "Book Now" },
];

const INC_ICONS: Record<string, string> = {
  structor: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  equipment: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  lift: "M13 10V3L4 14h7v7l9-11h-7z",
  bed: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  food: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2v4m0 0a2 2 0 100 4 2 2 0 000-4z",
  certificate: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  firstaid: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  photos: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
};

const TYPE_COLORS: Record<string, { gradient: string; badge: string }> = {
  Skiing: { gradient: "from-sky-500 to-cyan-400", badge: "bg-sky-100 text-sky-700" },
  Snowboarding: { gradient: "from-blue-500 to-indigo-400", badge: "bg-blue-100 text-blue-700" },
  Backcountry: { gradient: "from-violet-500 to-purple-400", badge: "bg-violet-100 text-violet-700" },
};

const WA_BASE = "https://wa.me/917817912062?text=";

/* ─── Availability / batch schedule (derived from the course season + duration) ─── */
type CAvail = "available" | "few" | "sold";
type CourseBatch = { id: string; label: string; iso: string; days: number; price: number; availability: CAvail };

const CMONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CAVAIL: Record<CAvail, { color: string; label: string }> = {
  available: { color: "#16A34A", label: "Available" },
  few: { color: "#D97706", label: "Filling Fast" },
  sold: { color: "#DC2626", label: "Sold Out" },
};
const C_CYCLE: CAvail[] = ["available", "available", "few", "available", "few", "sold"];

function courseDays(duration: string): number {
  const m = duration.match(/\d+/);
  return m ? parseInt(m[0], 10) : 7;
}

function fmtCourseDate(year: number, monthIdx: number, day: number): string {
  const d = new Date(year, monthIdx, day); // fixed inputs → deterministic (no hydration mismatch)
  return `${d.getDate()} ${CMONTHS[d.getMonth()]}`;
}

// Parse the season string (e.g. "Dec 2026 — Mar 2027") + duration into upcoming batches.
function getCourseBatches(course: Course): CourseBatch[] {
  const monthTokens = (course.dates.match(/[A-Za-z]{3,}/g) ?? [])
    .map((t) => CMONTHS.findIndex((x) => x.toLowerCase() === t.slice(0, 3).toLowerCase()))
    .filter((i) => i >= 0);
  const years = (course.dates.match(/20\d{2}/g) ?? []).map(Number);
  const days = courseDays(course.duration);

  const startM = monthTokens[0] ?? 11;
  const startY = years[0] ?? 2026;
  const endM = monthTokens[1] ?? (startM + 2) % 12;
  const endY = years[years.length - 1] ?? startY;

  const months: { m: number; y: number }[] = [];
  let m = startM;
  let y = startY;
  for (let guard = 0; guard < 24; guard++) {
    months.push({ m, y });
    if (m === endM && y === endY) break;
    m += 1;
    if (m > 11) { m = 0; y += 1; }
  }

  const startDays = [8, 22];
  const out: CourseBatch[] = [];
  let ci = 0;
  for (const mo of months) {
    for (const sd of startDays) {
      const end = new Date(mo.y, mo.m, sd + days - 1);
      out.push({
        id: `${course.slug}-${mo.y}-${mo.m}-${sd}`,
        label: `${fmtCourseDate(mo.y, mo.m, sd)} – ${fmtCourseDate(end.getFullYear(), end.getMonth(), end.getDate())} ${end.getFullYear()}`,
        iso: new Date(mo.y, mo.m, sd).toISOString().slice(0, 10),
        days,
        price: course.price,
        availability: C_CYCLE[ci++ % C_CYCLE.length],
      });
      if (out.length >= 6) break;
    }
    if (out.length >= 6) break;
  }
  return out;
}

function AvailabilityView({ batches, currency, onBook }: { batches: CourseBatch[]; currency: string; onBook: (iso: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Batches</h2>
      <p className="text-gray-600 mb-6">Live availability for this course — pick a batch and reserve your spot.</p>
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs">
        {(Object.keys(CAVAIL) as CAvail[]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5 text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CAVAIL[k].color }} />
            {CAVAIL[k].label}
          </span>
        ))}
      </div>
      <div className="space-y-2.5">
        {batches.map((b) => (
          <CourseBatchRow key={b.id} b={b} currency={currency} onBook={onBook} />
        ))}
      </div>
    </div>
  );
}

function CourseBatchRow({ b, currency, onBook }: { b: CourseBatch; currency: string; onBook: (iso: string) => void }) {
  const a = CAVAIL[b.availability];
  const sold = b.availability === "sold";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3.5">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm">{b.label}</div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
          <span>{b.days} Days</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
            <span style={{ color: a.color }} className="font-medium">{a.label}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="text-right">
          <div className="font-bold text-gray-900 text-sm">{currency}{b.price.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-gray-500">/ person</div>
        </div>
        <button
          disabled={sold}
          onClick={() => onBook(b.iso)}
          aria-label={sold ? `${b.label} sold out` : `Book ${b.label}`}
          className={`rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 ${sold ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-sky-500 text-white hover:bg-sky-600"}`}
        >
          {sold ? "Sold Out" : "Book"}
        </button>
      </div>
    </div>
  );
}

interface Props {
  course: Course;
}

export default function CourseDetailClient({ course }: Props) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    groupSize: "1",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const colors = TYPE_COLORS[course.type];
  const images = course.gallery || [course.image];

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Switch tab, center it in the strip, and jump the panel just below the sticky bar.
  const goToTab = (key: Tab) => {
    setTab(key);
    const idx = TAB_LIST.findIndex((t) => t.key === key);
    tabRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    document.getElementById("course-tabpanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Book a specific batch → prefill the date and jump to the booking form.
  const registerForBatch = (iso: string) => {
    setBookingForm((f) => ({ ...f, date: iso }));
    goToTab("book");
  };

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % images.length));
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      // new / signed-out visitors go straight to sign-up to create an account
      window.location.href = "/signup";
      return;
    }
    setSubmitting(true);
    try {
      await createActivityBooking({
        user_id: user.id,
        activity_type: "skiing",
        activity_name: course.name,
        activity_date: bookingForm.date,
        group_size: bookingForm.groupSize,
        message: `Name: ${bookingForm.name}, Email: ${bookingForm.email}, Phone: ${bookingForm.phone}. ${bookingForm.message}`,
      });
      setSent(true);
    } catch {
      // ponytail: show error state
      alert("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = `${WA_BASE}${encodeURIComponent(
    `Hi! I'm interested in the ${course.name} (${course.type}) in Auli.`
  )}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${colors.gradient} py-20 overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <img src={course.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            All Courses
          </Link>
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
            AULI SNOW SPORTS ACADEMY
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
            {course.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            {course.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", label: course.duration },
              { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", label: course.location },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: course.level },
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", label: "Certified" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="sticky top-16 z-30 mb-8 border-b border-gray-200 bg-white/90 backdrop-blur-md">
              <div className="flex gap-1 overflow-x-auto">
                {TAB_LIST.map((t, i) => (
                  <button
                    key={t.key}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    onClick={() => goToTab(t.key)}
                    className={`px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm font-medium whitespace-nowrap transition-colors relative active:scale-95 ${
                      tab === t.key
                        ? "text-sky-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.label}
                    {tab === t.key && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={tab}
              id="course-tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="scroll-mt-36"
            >
              {tab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                  <p className="text-gray-600 leading-relaxed mb-8">{course.description}</p>

                  {(course.levelRequirement || course.instructorRatio || course.weeklyHours) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {[
                        { label: "Level Requirement", value: course.levelRequirement },
                        { label: "Group Size", value: course.instructorRatio },
                        { label: "Training Hours", value: course.weeklyHours },
                      ]
                        .filter((f) => f.value)
                        .map((f) => (
                          <div key={f.label} className="bg-sky-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">{f.label}</p>
                            <p className="text-sm text-gray-700">{f.value}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  {course.highlights && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Course Highlights</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Available Dates</h3>
                  <div className="bg-sky-50 rounded-xl p-6 mb-8">
                    <p className="text-sky-700 font-semibold">{course.dates}</p>
                    <p className="text-sky-600 text-sm mt-1">{course.duration} intensive course</p>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">Testimonials</h3>
                  <div className="space-y-4">
                    {course.testimonials.map((t, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                        <p className="text-gray-600 italic mb-2">&ldquo;{t.text}&rdquo;</p>
                        <p className="text-sm font-medium text-gray-900">{t.name} — {t.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "dates" && (
                <AvailabilityView batches={getCourseBatches(course)} currency={course.currency} onBook={registerForBatch} />
              )}

              {tab === "itinerary" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.duration} Itinerary</h2>
                  <p className="text-gray-600 mb-8">A structured progression from first turns to certified confidence.</p>
                  <div className="space-y-6">
                    {course.itinerary.map((day) => (
                      <div key={day.day} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                          {day.day}
                        </div>
                        <div className="flex-1 pb-6 border-b border-gray-100 last:border-0">
                          <h3 className="font-bold text-gray-900 mb-1">{day.title}</h3>
                          <p className="text-gray-600 text-sm">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "gallery" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Gallery</h2>
                  <p className="text-gray-600 mb-8">Moments from our skiing and snowboarding courses in Auli.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLightbox(i)}
                        aria-label={`View photo ${i + 1} of ${images.length}`}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={img}
                          alt={`${course.name} — photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <svg className="w-8 h-8 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 7.5v6m3-3h-6M21 21l-5.2-5.2" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Lightbox */}
                  <AnimatePresence>
                    {lightbox !== null && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                      >
                        <button
                          onClick={() => setLightbox(null)}
                          className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                          aria-label="Close lightbox"
                        >
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length)); }}
                          className="absolute left-4 text-white/80 hover:text-white z-10 p-2"
                          aria-label="Previous photo"
                        >
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        <motion.div
                          key={lightbox}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="max-w-4xl max-h-[80vh] relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={images[lightbox]}
                            alt={`${course.name} — photo ${lightbox + 1}`}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                          />
                        </motion.div>

                        <button
                          onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i === null ? i : (i + 1) % images.length)); }}
                          className="absolute right-4 text-white/80 hover:text-white z-10 p-2"
                          aria-label="Next photo"
                        >
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        <div className="absolute bottom-4 text-white/80 text-sm">
                          {lightbox + 1} / {images.length}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {tab === "included" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">What&apos;s Included</h2>
                  <p className="text-gray-600 mb-8">Everything you need for a seamless mountain experience.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {course.inclusions.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={INC_ICONS[item.icon] || INC_ICONS.structor} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "book" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Course</h2>
                  {sent ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                      <p className="text-gray-600 mb-4">We&apos;ll contact you soon with course details.</p>
                      <button onClick={() => setSent(false)} className="text-sky-600 hover:underline">
                        Book another course
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBook} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={bookingForm.name}
                            onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={bookingForm.email}
                            onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <input
                            type="tel"
                            required
                            value={bookingForm.phone}
                            onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                          <input
                            type="date"
                            required
                            value={bookingForm.date}
                            onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                          <select
                            value={bookingForm.groupSize}
                            onChange={(e) => setBookingForm({ ...bookingForm, groupSize: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          >
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                        <textarea
                          rows={3}
                          value={bookingForm.message}
                          onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          placeholder="Any special requirements or questions..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Submitting..." : "Submit Booking"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {course.type}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">Rs.{course.price.toLocaleString("en-IN")}</span>
                <span className="text-gray-500 ml-1">/ person</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{course.duration} · {course.dates}</p>
              
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-green-500 text-white text-center font-semibold rounded-lg hover:bg-green-600 transition-colors mb-3"
              >
                Book on WhatsApp
              </a>
              <button
                onClick={() => goToTab("book")}
                className="block w-full py-3 border-2 border-sky-500 text-sky-600 text-center font-semibold rounded-lg hover:bg-sky-50 transition-colors"
              >
                Book Online
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Certified instruction
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  All equipment included
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Accommodation & meals
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Free cancellation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
