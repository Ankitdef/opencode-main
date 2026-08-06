"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { createActivityBooking } from "@/lib/auth";

type Tab = "overview" | "itinerary" | "levels" | "videos" | "book";

const TAB_LIST: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "itinerary", label: "Itinerary" },
  { key: "levels", label: "Skill Levels" },
  { key: "videos", label: "Videos" },
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

const skillLevels = [
  {
    level: "Beginner",
    icon: "🟢",
    color: "emerald",
    description: "Never been on snow before? Perfect. You'll learn the absolute basics — how to stand, move, and stop safely.",
    skills: ["Stance & balance", "Snowplough turns", "Safe falling & recovery", "First chairlift ride"],
    who: "First-timers, families, anyone curious about snow sports",
  },
  {
    level: "Intermediate",
    icon: "🔵",
    color: "sky",
    description: "You can link turns on blue runs and want to build confidence on steeper terrain with better technique.",
    skills: ["Parallel turns", "Carving basics", "Speed control", "Red run readiness"],
    who: "Returners, fitness enthusiasts, adventure seekers",
  },
  {
    level: "Advanced",
    icon: "🔴",
    color: "red",
    description: "Comfortable on all groomed runs? Time to explore off-piste, powder, and backcountry touring.",
    skills: ["Off-piste technique", "Powder turns", "Avalanche awareness", "Backcountry touring"],
    who: "Experienced riders, backcountry curious, season pass holders",
  },
];

const videos = [
  {
    title: "Skiing in Auli — Your First Day on Snow",
    description: "Watch our instructors guide complete beginners through their first turns beneath Nanda Devi.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80",
  },
  {
    title: "Snowboarding Progression — Day 1 to Day 7",
    description: "See the incredible improvement our students make in just one week of guided instruction.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80",
  },
  {
    title: "Backcountry Ski Touring in the Himalayas",
    description: "A taste of what advanced riders experience on our backcountry touring course.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
];

const inclusions = [
  "Certified ski / snowboard instructor",
  "All equipment & safety gear",
  "Auli cable car & lift passes",
  "Accommodation and all meals",
  "Beginner-to-intermediate progression",
  "Course completion certificate",
  "Emergency first aid support",
  "Photos from your week",
];

const courses = [
  { type: "Skiing", title: "7-Day Skiing Course", price: "₹30,000", gradient: "from-sky-400 to-cyan-300", featured: false },
  { type: "Snowboarding", title: "7-Day Snowboarding Course", price: "₹35,000", gradient: "from-blue-500 to-indigo-400", featured: true },
  { type: "Backcountry", title: "Backcountry Ski Touring", price: "₹45,000", gradient: "from-violet-500 to-purple-400", featured: false },
];

const SKIING_WA = `https://wa.me/917817912062?text=${encodeURIComponent(
  "Hi! I'm interested in the 7-day Skiing & Snowboarding course in Auli."
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
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: "", email: "", phone: "", date: "", groupSize: "1", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

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

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* Header */}
            <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white sm:p-8 flex-shrink-0">
              <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-100">Auli Snow Sports Academy</p>
              <h3 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Skiing &amp; Snowboarding</h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white/15 px-3 py-1">7 Days</span>
                <span className="rounded-full bg-white/15 px-3 py-1">Auli, Uttarakhand</span>
                <span className="rounded-full bg-white/15 px-3 py-1">₹30K–45K</span>
                <span className="rounded-full bg-white/15 px-3 py-1">All Levels</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 overflow-x-auto flex-shrink-0">
              {TAB_LIST.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    tab === t.key ? "border-sky-500 text-sky-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}>{t.label}</button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">

              {/* ─── Overview Tab ─── */}
              {tab === "overview" && (
                <div>
                  <p className="text-muted leading-relaxed mb-6">
                    Whether you&apos;re a complete beginner or looking to refine your technique, our certified instructors
                    guide you through a structured 7-day progression on the slopes of Auli — with the majestic
                    Nanda Devi as your backdrop.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {courses.map((c) => (
                      <button key={c.type} onClick={() => setSelectedCourse(c.type)}
                        className={`rounded-2xl p-5 text-left transition-all ${
                          selectedCourse === c.type
                            ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-400"
                            : "bg-gray-50 text-foreground hover:bg-gray-100 ring-1 ring-gray-200"
                        }`}>
                        <p className={`text-xs font-semibold uppercase ${selectedCourse === c.type ? "text-white/70" : "text-sky-600"}`}>{c.type}</p>
                        <p className="font-heading text-lg font-bold mt-1">{c.price}</p>
                        <p className={`text-xs mt-1 ${selectedCourse === c.type ? "text-white/60" : "text-muted"}`}>7-day course</p>
                      </button>
                    ))}
                  </div>
                  <div className="bg-sky-50 rounded-2xl p-5">
                    <h4 className="font-heading font-bold text-sky-900 mb-2">Why Auli?</h4>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm text-sky-800">
                      <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> 3,050m altitude — reliable snow Dec–Mar</li>
                      <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> India&apos;s longest cable car (4 km)</li>
                      <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Views of Nanda Devi (7,816m)</li>
                      <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Beginner nursery to intermediate runs</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ─── Itinerary Tab ─── */}
              {tab === "itinerary" && (
                <div>
                  <h4 className="font-heading text-lg font-bold text-foreground mb-4">7-Day Course Itinerary</h4>
                  <ol className="space-y-4">
                    {itinerary.map((d) => (
                      <li key={d.day} className="flex gap-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">{d.day}</div>
                        <div>
                          <p className="font-semibold text-foreground">{d.title}</p>
                          <p className="text-sm text-muted mt-0.5">{d.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-8">
                    <h4 className="font-heading text-lg font-bold text-foreground mb-3">What&apos;s Included</h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {inclusions.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                          <svg className="h-4 w-4 flex-shrink-0 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ─── Skill Levels Tab ─── */}
              {tab === "levels" && (
                <div>
                  <h4 className="font-heading text-lg font-bold text-foreground mb-4">Choose Your Level</h4>
                  <p className="text-muted text-sm mb-6">Every course is tailored to your current ability. Here&apos;s what to expect at each level.</p>
                  <div className="space-y-5">
                    {skillLevels.map((l) => (
                      <div key={l.level} className={`rounded-2xl p-5 ring-1 ${
                        l.color === "emerald" ? "bg-emerald-50 ring-emerald-200" : l.color === "sky" ? "bg-sky-50 ring-sky-200" : "bg-red-50 ring-red-200"
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{l.icon}</span>
                          <h5 className="font-heading font-bold text-foreground">{l.level}</h5>
                        </div>
                        <p className="text-sm text-muted mb-3">{l.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {l.skills.map((s) => (
                            <span key={s} className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              l.color === "emerald" ? "bg-emerald-100 text-emerald-700" : l.color === "sky" ? "bg-sky-100 text-sky-700" : "bg-red-100 text-red-600"
                            }`}>{s}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted">Ideal for: {l.who}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Videos Tab ─── */}
              {tab === "videos" && (
                <div>
                  <h4 className="font-heading text-lg font-bold text-foreground mb-2">Watch & Get Inspired</h4>
                  <p className="text-muted text-sm mb-6">See what our courses look like on the slopes of Auli.</p>
                  <div className="space-y-5">
                    {videos.map((v, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden bg-gray-50 ring-1 ring-gray-200">
                        {playingVideo === i ? (
                          <div className="aspect-video">
                            <iframe src={`${v.url}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={v.title} />
                          </div>
                        ) : (
                          <button onClick={() => setPlayingVideo(i)} className="w-full relative aspect-video group">
                            <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <svg className="h-7 w-7 text-sky-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </div>
                          </button>
                        )}
                        <div className="p-4">
                          <h5 className="font-semibold text-foreground">{v.title}</h5>
                          <p className="text-sm text-muted mt-1">{v.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Book Tab ─── */}
              {tab === "book" && (
                <div>
                  {sent ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Booking Request Sent!</h3>
                      <p className="text-muted max-w-sm mx-auto">Our team will confirm availability for the {selectedCourse} course within 24 hours.</p>
                      <button onClick={() => { setSent(false); setTab("overview"); }} className="mt-4 text-sky-600 font-semibold hover:underline">Book another course</button>
                    </div>
                  ) : (
                    <form onSubmit={handleBook} className="space-y-5">
                      <div>
                        <p className="text-sm text-muted mb-3">Selected: <span className="font-semibold text-foreground">{selectedCourse} Course — {courses.find((c) => c.type === selectedCourse)?.price}</span></p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                          <input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                          <input type="email" required value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                          <input type="tel" required value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Preferred Date</label>
                          <input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Group Size</label>
                        <select value={bookingForm.groupSize} onChange={(e) => setBookingForm({ ...bookingForm, groupSize: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Person" : "Persons"}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Message (optional)</label>
                        <textarea rows={3} value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                          placeholder="Any special requirements..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={submitting}
                          className="flex-1 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors disabled:opacity-70">
                          {submitting ? "Sending…" : "Book on WhatsApp"}
                        </button>
                        <a href={SKIING_WA} target="_blank" rel="noopener noreferrer"
                          className="py-3 px-6 border border-sky-500 text-sky-600 font-semibold rounded-xl hover:bg-sky-50 transition-colors text-sm">
                          WhatsApp Direct
                        </a>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
              <p className="text-2xl font-bold text-foreground">
                {courses.find((c) => c.type === selectedCourse)?.price}
                <span className="text-sm font-normal text-muted"> / 7-day course</span>
              </p>
              <div className="flex gap-3">
                <a href={SKIING_WA} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sky-600">
                  Book on WhatsApp
                </a>
                <Link href="/contact" onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-50">
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
