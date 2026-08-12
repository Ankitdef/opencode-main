"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createActivityBooking } from "@/lib/auth";

type Tab = "overview" | "itinerary" | "included" | "book";

const TAB_LIST: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "itinerary", label: "Itinerary" },
  { key: "included", label: "What's Included" },
  { key: "book", label: "Book Now" },
];

const itinerary = [
  { day: 1, title: "Arrive Joshimath & Gear Up", text: "Meet your instructors, get fitted for boots and skis or a board, and settle into your Auli-base stay." },
  { day: 2, title: "First Turns on the Nursery Slopes", text: "Ride the Auli cable car up and learn the fundamentals — stance, balance and how to stop with confidence." },
  { day: 3, title: "Snowplough & Controlled Stops", text: "Build control on gentle gradients: snowplough turns, edging, and safe falling and recovery." },
  { day: 4, title: "Linking Your Turns", text: "Start linking turns down beginner blue runs with your instructor reading the slope alongside you." },
  { day: 5, title: "Chairlift & Longer Descents", text: "Take the chairlift for longer runs, refine your technique and carry more speed across wider pistes." },
  { day: 6, title: "Intermediate Slopes & Off-Piste Taster", text: "Progress to steeper runs and a guided taste of soft off-piste snow beneath Nanda Devi." },
  { day: 7, title: "Assessment & Certification", text: "A final assessed run, your course certificate, and a celebratory send-off before departure." },
];

const inclusions = [
  { icon: "structor", label: "Certified Instructor", desc: "Professional ski & snowboard coaches" },
  { icon: "equipment", label: "All Equipment", desc: "Boards, skis, boots, helmets & poles" },
  { icon: "lift", label: "Lift Passes", desc: "Full Auli cable car & chairlift access" },
  { icon: "bed", label: "Accommodation", desc: "7 nights in Auli-base stay" },
  { icon: "food", label: "All Meals", desc: "Breakfast, lunch & dinner included" },
  { icon: "certificate", label: "Certification", desc: "Course completion certificate" },
  { icon: "firstaid", label: "Safety Support", desc: "Emergency first aid on slope" },
  { icon: "photos", label: "Course Photos", desc: "Professional shots from your week" },
];

const courses = [
  {
    type: "Skiing",
    title: "7-Day Skiing Course",
    price: "₹30,000",
    dates: "Dec 2026 — Mar 2027",
    gradient: "from-sky-400 to-cyan-300",
    ring: "ring-sky-400",
    bg: "bg-sky-50",
    text: "text-sky-700",
    badge: "bg-sky-100",
  },
  {
    type: "Snowboarding",
    title: "7-Day Snowboarding Course",
    price: "₹35,000",
    dates: "Dec 2026 — Mar 2027",
    gradient: "from-blue-500 to-indigo-400",
    ring: "ring-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100",
    featured: true,
  },
  {
    type: "Backcountry",
    title: "Backcountry Ski Touring",
    price: "₹45,000",
    dates: "Jan — Mar 2027",
    gradient: "from-violet-500 to-purple-400",
    ring: "ring-violet-400",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
];

const COURSE_PAGE_SLUGS: Record<string, string> = {
  Skiing: "/courses/skiing-course",
  Snowboarding: "/courses/snowboarding-course",
  Backcountry: "/courses/backcountry-skiing",
};

const testimonials = [
  { name: "Priya M.", location: "Mumbai", text: "Best week of my life! The instructors were patient and I went from zero to linking turns in 5 days. Nanda Devi views are unreal." },
  { name: "Arjun K.", location: "Delhi", text: "The backcountry touring course was incredible. Professional setup, great gear, and the guides know every inch of these mountains." },
  { name: "Sneha R.", location: "Bangalore", text: "Came for snowboarding, stayed for the vibes. The Auli cable car ride alone is worth the trip. Already booked for next season." },
];

const SKIING_WA = `https://wa.me/917817912062?text=${encodeURIComponent(
  "Hi! I'm interested in the skiing/snowboarding course in Auli."
)}`;

interface Props {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

export default function SkiingCourseModal({ open, onClose, initialTab = "overview" }: Props) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [selectedCourse, setSelectedCourse] = useState("Snowboarding");
  const [bookingForm, setBookingForm] = useState({ name: "", email: "", phone: "", date: "", groupSize: "1", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset tab when modal opens; no cascading renders here
  useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { window.location.href = "/login"; return; }
    setSubmitting(true);
    try {
      await createActivityBooking({
        user_id: user.id,
        activity_name: selectedCourse === "Snowboarding" ? "7-Day Snowboarding Course" : selectedCourse === "Skiing" ? "7-Day Skiing Course" : "Backcountry Ski Touring",
        activity_type: selectedCourse,
        activity_date: bookingForm.date,
        group_size: bookingForm.groupSize,
        message: bookingForm.message,
      });
    } catch { /* still send WhatsApp */ }
    const text = encodeURIComponent(`Course: ${selectedCourse} in Auli\nDate: ${bookingForm.date}\nGroup: ${bookingForm.groupSize}\nName: ${bookingForm.name}\nPhone: ${bookingForm.phone}`);
    window.open(`https://wa.me/917817912062?text=${text}`, "_blank");
    setSubmitting(false);
    setSent(true);
  };

  const selected = courses.find((c) => c.type === selectedCourse)!;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* ─── Hero Header ─── */}
            <div className="relative bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-8 text-white sm:p-10 flex-shrink-0 overflow-hidden">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/5" />
              <button onClick={onClose} aria-label="Close"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25 backdrop-blur-sm">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Auli Snow Sports Academy</p>
              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl leading-tight">Skiing &amp; Snowboarding<br />in the Himalayas</h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: "7 Days", icon: "📅" },
                  { label: "Auli, Uttarakhand", icon: "📍" },
                  { label: "All Levels", icon: "🏔" },
                  { label: "Certified", icon: "✅" },
                ].map((b) => (
                  <span key={b.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                    <span>{b.icon}</span> {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── Tabs ─── */}
            <div className="flex border-b border-gray-200 px-6 overflow-x-auto flex-shrink-0 bg-gray-50/80">
              {TAB_LIST.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                    tab === t.key ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>{t.label}</button>
              ))}
            </div>

            {/* ─── Body ─── */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">

              {/* ═══ Overview Tab ═══ */}
              {tab === "overview" && (
                <div className="space-y-8">
                  {/* Intro */}
                  <div>
                    <p className="text-lg leading-relaxed text-gray-600">
                      Whether you&apos;re a complete beginner or looking to refine your technique, our certified instructors
                      guide you through a structured 7-day progression on the slopes of Auli — with the majestic
                      Nanda Devi (7,816m) as your backdrop.
                    </p>
                  </div>

                  {/* Course Cards — SIA-style "Available Courses" */}
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">Available Courses</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {courses.map((c) => (
                        <button key={c.type} onClick={() => setSelectedCourse(c.type)}
                          className={`relative rounded-2xl p-6 text-left transition-all ring-2 ${
                            selectedCourse === c.type
                              ? `${c.bg} ${c.ring} shadow-lg`
                              : "bg-white ring-gray-200 hover:ring-gray-300 hover:shadow-md"
                          }`}>
                          {c.featured && (
                            <span className="absolute -top-3 right-4 rounded-full bg-blue-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                              Most Popular
                            </span>
                          )}
                          <p className={`text-xs font-bold uppercase tracking-wider ${selectedCourse === c.type ? c.text : "text-sky-600"}`}>{c.type}</p>
                          <p className="mt-2 font-heading text-2xl font-bold text-gray-900">{c.price}</p>
                          <p className="mt-1 text-sm text-gray-500">{c.dates}</p>
                          <p className="mt-1 text-xs text-gray-400">7-day course</p>
                          {selectedCourse === c.type && (
                            <div className={`absolute top-4 right-4 h-5 w-5 rounded-full ${c.gradient} flex items-center justify-center`}>
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Facts */}
                  <div className="rounded-2xl bg-sky-50 p-6">
                    <h4 className="font-heading text-xl font-bold text-sky-900 mb-4">Why Auli?</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { stat: "3,050m", label: "Altitude — reliable snow Dec–Mar" },
                        { stat: "4 km", label: "India's longest cable car ride" },
                        { stat: "7,816m", label: "Nanda Devi peak views" },
                        { stat: "7 Days", label: "Beginner to intermediate progression" },
                      ].map((f) => (
                        <div key={f.stat} className="flex items-start gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-100 font-heading text-sm font-bold text-sky-700">{f.stat}</span>
                          <p className="text-sm text-sky-800 pt-2">{f.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div>
                    <h4 className="font-heading text-xl font-bold text-gray-900 mb-4">What People Say</h4>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {testimonials.map((t) => (
                        <div key={t.name} className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
                          <div className="flex mb-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">&quot;{t.text}&quot;</p>
                          <p className="mt-3 text-sm font-semibold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ Itinerary Tab ═══ */}
              {tab === "itinerary" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">7-Day Course Itinerary</h3>
                    <p className="text-gray-500">A structured progression from first turns to certified confidence.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-sky-100" />
                    <div className="space-y-6">
                      {itinerary.map((d) => (
                        <div key={d.day} className="relative flex gap-5 pl-2">
                          <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 font-heading text-sm font-bold text-white shadow-lg shadow-sky-500/25">
                            {d.day}
                          </div>
                          <div className="flex-1 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
                            <p className="font-heading text-lg font-bold text-gray-900">{d.title}</p>
                            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{d.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ What's Included Tab ═══ */}
              {tab === "included" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">What&apos;s Included</h3>
                    <p className="text-gray-500">Everything you need for a seamless mountain experience.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {inclusions.map((item) => (
                      <div key={item.icon} className="flex items-start gap-4 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100 transition-colors hover:bg-sky-50 hover:ring-sky-100">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                          {item.icon === "structor" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>}
                          {item.icon === "equipment" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg>}
                          {item.icon === "lift" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>}
                          {item.icon === "bed" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
                          {item.icon === "food" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 11-6 0 3.354 3.354 0 016 0zm2.25-3.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>}
                          {item.icon === "certificate" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>}
                          {item.icon === "firstaid" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}
                          {item.icon === "photos" && <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ Book Tab ═══ */}
              {tab === "book" && (
                <div>
                  {sent ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Request Sent!</h3>
                      <p className="text-gray-500 max-w-md mx-auto text-lg">Our team will confirm availability for the {selectedCourse} course within 24 hours.</p>
                      <button onClick={() => { setSent(false); setTab("overview"); }} className="mt-6 text-sky-600 font-semibold hover:underline text-lg">Book another course</button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Selected Course Summary */}
                      <div className={`rounded-2xl p-6 ${selected.bg} ring-1 ${selected.ring}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-bold uppercase tracking-wider ${selected.text}`}>{selected.type} Course</p>
                            <p className="mt-1 font-heading text-3xl font-bold text-gray-900">{selected.price}</p>
                            <p className="text-sm text-gray-500 mt-1">{selected.dates} · 7 days</p>
                          </div>
                          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${selected.gradient} flex items-center justify-center`}>
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                          </div>
                        </div>
                      </div>

                      {/* Booking Form */}
                      <form onSubmit={handleBook} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <input type="email" required value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                            <input type="tel" required value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Date</label>
                            <input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group Size</label>
                          <select value={bookingForm.groupSize} onChange={(e) => setBookingForm({ ...bookingForm, groupSize: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow">
                            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message (optional)</label>
                          <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                            placeholder="Any special requirements..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none transition-shadow" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <button type="submit" disabled={submitting}
                            className="flex-1 py-3.5 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-70 text-base">
                            {submitting ? "Sending…" : "Book on WhatsApp"}
                          </button>
                          <a href={SKIING_WA} target="_blank" rel="noopener noreferrer"
                            className="py-3.5 px-6 border border-sky-500 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-colors text-base">
                            WhatsApp Direct
                          </a>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ─── Footer ─── */}
            <div className="flex flex-col gap-4 border-t border-gray-100 p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between flex-shrink-0 bg-gray-50/50">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {selected.price}
                </p>
                <p className="text-sm text-gray-500">per person · 7-day course</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={SKIING_WA} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-500/25">
                  Book on WhatsApp
                </a>
                <Link href={COURSE_PAGE_SLUGS[selectedCourse]} onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-sky-500 px-6 py-3.5 text-base font-semibold text-sky-600 transition-colors hover:bg-sky-50">
                  View Course
                </Link>
                <Link href="/contact" onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:bg-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
