"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/MotionWrapper";

// Inline SVG Icon components matching the codebase pattern
function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function FileTextIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CreditCardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function RefreshIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function CloudLightningIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function MountainIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l9 18H3l9-18z" />
    </svg>
  );
}

function InfoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function UserXIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
    </svg>
  );
}

function CalendarXIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6l3 3m0-3l-3 3" />
    </svg>
  );
}

function XCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ReceiptTextIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25h6m-6-3h6m-6-3h6m2.5-7.5l-3 3m0 0l-3-3m3 3V2.25m0 16.5h-10.5a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 014.5 4.5h6.75" />
    </svg>
  );
}

function MailIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MessageCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641l-.442 1.768a1.875 1.875 0 002.261 2.261l1.768-.442c.6-.154 1.194.154 1.641.586A9.49 9.49 0 0012 20.25z" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

const REFUND_TIERS = [
  {
    window: "20+ days before departure",
    percent: 90,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800/40",
    textColor: "text-emerald-700 dark:text-emerald-400",
    description:
      "Cancel well in advance and receive almost your entire booking amount back.",
  },
  {
    window: "10–20 days before departure",
    percent: 60,
    color: "bg-amber-500",
    lightColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    textColor: "text-amber-700 dark:text-amber-400",
    description:
      "A majority of your booking amount is returned when you cancel within this window.",
  },
  {
    window: "3–9 days before departure",
    percent: 20,
    color: "bg-orange-500",
    lightColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800/40",
    textColor: "text-orange-700 dark:text-orange-400",
    description:
      "A partial refund is issued to cover operational commitments already made.",
  },
  {
    window: "Less than 72 hours / No Show",
    percent: 0,
    color: "bg-red-500",
    lightColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800/40",
    textColor: "text-red-700 dark:text-red-400",
    description:
      "Unfortunately, no refund is available once you are within 72 hours of departure or if the trek has already begun.",
  },
];

const CANCELLATION_STEPS = [
  {
    step: 1,
    title: "Submit Your Request",
    description:
      "Reach out to us via email, WhatsApp, or phone with your booking ID and reason for cancellation.",
    icon: FileTextIcon,
  },
  {
    step: 2,
    title: "Request Acknowledged",
    description:
      "We will acknowledge your request within one business day and begin processing it.",
    icon: CheckCircleIcon,
  },
  {
    step: 3,
    title: "Refund Calculated",
    description:
      "Your refund is determined based on the cancellation timeline against our policy.",
    icon: CreditCardIcon,
  },
  {
    step: 4,
    title: "Amount Returned",
    description:
      "The eligible refund is credited to your original payment method within 7–10 business days.",
    icon: RefreshIcon,
  },
];

const COMPANY_CANCELLATION_REASONS = [
  {
    icon: CloudLightningIcon,
    title: "Extreme Weather",
    description:
      "Severe weather warnings such as heavy rainfall, snowstorms, or flash flood alerts that make the route unsafe for trekking.",
  },
  {
    icon: AlertTriangleIcon,
    title: "Natural Disasters",
    description:
      "Unpredictable events including earthquakes, landslides, or avalanches that affect trail conditions and safety.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Government Restrictions",
    description:
      "Official advisories, route bans, permit revocations, or administrative orders that restrict access to trekking zones.",
  },
  {
    icon: MountainIcon,
    title: "Road Closures",
    description:
      "Blocked access roads due to landslides, construction, or snow accumulation preventing reach to the trailhead.",
  },
  {
    icon: InfoIcon,
    title: "Safety Concerns",
    description:
      "Operational assessments indicating that proceeding with the trek would pose unacceptable risk to participants.",
  },
  {
    icon: CloudLightningIcon,
    title: "Force Majeure",
    description:
      "Any extraordinary event beyond our control — pandemics, civil unrest, or other unforeseeable circumstances.",
  },
];

const NO_SHOW_SCENARIOS = [
  {
    icon: UserXIcon,
    title: "Late Arrival",
    text: "Failure to arrive at the designated meeting point or pickup location by the scheduled time.",
  },
  {
    icon: CalendarXIcon,
    title: "Missed Pickup",
    text: "Not being present at the arranged pickup point, resulting in the team proceeding without you.",
  },
  {
    icon: XCircleIcon,
    title: "Mid-Trek Departure",
    text: "Leaving the trek at any point during the itinerary for personal reasons or preference.",
  },
  {
    icon: XCircleIcon,
    title: "Unused Services",
    text: "Choosing not to avail included meals, accommodation, or transport that form part of the package.",
  },
];

const NON_REFUNDABLE_ITEMS = [
  "Trek permits and forest entry fees already processed",
  "Government levies, taxes, and regulatory charges",
  "Payment gateway or bank transaction charges",
  "Third-party vendor costs already committed (camp, mule, local transport)",
  "Insurance premiums, if purchased through us",
];

const FAQS = [
  {
    q: "How is the cancellation date determined?",
    a: "Your cancellation date is the day we receive your written request via email or WhatsApp. Requests received after business hours are timestamped the following business day. The refund percentage is calculated against your trek departure date, not the date of booking.",
  },
  {
    q: "Can I transfer my booking to someone else instead of cancelling?",
    a: "Yes, you may transfer your booking to another person up to 10 days before departure. The new participant must meet any fitness or age requirements for the trek. A one-time transfer fee may apply to cover administrative changes.",
  },
  {
    q: "What if the company cancels my trek — will I get a full refund?",
    a: "If we cancel a trek due to weather, natural disasters, government restrictions, safety concerns, or force majeure, you will be offered the choice of rescheduling to another batch, receiving a trek credit for future use, or a full refund of the trek booking amount. Any non-recoverable third-party costs will be transparently communicated.",
  },
  {
    q: "Are my travel expenses to the base camp refundable?",
    a: "No. Our refund policy applies exclusively to the trek booking amount paid to us. Any incidental costs — flights, train tickets, personal travel to the base camp, hotel stays before or after the trek, or personal gear purchases — are not covered under this policy.",
  },
  {
    q: "Can I reschedule instead of cancelling?",
    a: "Yes, you may request a one-time reschedule to a different batch, subject to availability and operational feasibility. Rescheduling requests must be made at least 7 days before your original departure date. A rescheduling fee may apply.",
  },
  {
    q: "How long does the refund take to reflect in my account?",
    a: "We process eligible refunds within 7–10 business days of approval. However, your bank or payment provider may take an additional 3–5 business days to credit the amount to your account. If you have not received your refund after 15 business days, please contact us with your booking ID.",
  },
];

export default function CancellationPolicyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* ─── Hero Section ─── */}
      <section className="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80"
          alt="Himalayan mountain range"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-[#0F172A]/80" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <ShieldCheckIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/90">
              Transparent &amp; Fair
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Cancellation &amp; Refund Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            We believe in clarity above all else. This policy is designed to be
            fair and straightforward for both trekkers and organizers — so you
            always know where you stand before, during, or after booking.
          </motion.p>
        </div>
      </section>

      {/* ─── Refund Timeline ─── */}
      <section className="py-section px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase text-accent">
              Refund Schedule
            </span>
            <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
              When You Cancel, Here&apos;s What Happens
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Refund amounts are calculated as a percentage of your total booking
              amount based on when the cancellation request is submitted.
            </p>
          </FadeUp>

          {/* Visual Timeline Cards */}
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14" staggerDelay={0.1}>
            {REFUND_TIERS.map((tier) => (
              <StaggerItem key={tier.percent}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-2xl p-6 border ${tier.lightColor} ${tier.borderColor} overflow-hidden`}
                >
                  {/* Progress bar top */}
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mb-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tier.percent || 5}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      className={`h-full rounded-full ${tier.color}`}
                    />
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl ${tier.color} flex items-center justify-center mb-4`}
                  >
                    <span className="text-white font-heading font-bold text-lg">
                      {tier.percent}%
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-foreground text-lg mb-2">
                    {tier.window}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {tier.description}
                  </p>

                  <div
                    className={`absolute -bottom-4 -right-4 w-24 h-24 ${tier.color} opacity-5 rounded-full`}
                  />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Responsive Table */}
          <FadeUp delay={0.2}>
            <div className="hidden lg:block glass-card rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface dark:bg-white/5">
                    <th className="px-6 py-4 font-heading font-semibold text-foreground text-sm">
                      Cancellation Window
                    </th>
                    <th className="px-6 py-4 font-heading font-semibold text-foreground text-sm text-center">
                      Refund Amount
                    </th>
                    <th className="px-6 py-4 font-heading font-semibold text-foreground text-sm">
                      What It Means
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {REFUND_TIERS.map((tier, i) => (
                    <tr
                      key={i}
                      className="border-t border-gray-100 dark:border-white/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">
                          {tier.window}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${tier.lightColor} ${tier.textColor}`}
                        >
                          {tier.percent}% Refund
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {tier.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Cancellation Procedure ─── */}
      <section className="py-section px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase text-secondary">
              How It Works
            </span>
            <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
              Cancellation Procedure
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              We keep the process simple. Submit your request through any of the
              channels below and we handle the rest.
            </p>
          </FadeUp>

          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            staggerDelay={0.1}
          >
            {CANCELLATION_STEPS.map((item) => {
              const IconComp = item.icon;
              return (
                <StaggerItem key={item.step}>
                  <div className="relative bg-white dark:bg-card rounded-2xl p-6 border border-gray-100 dark:border-white/10 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Contact channels */}
          <FadeUp delay={0.15}>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
              <h3 className="font-heading font-semibold text-foreground mb-2">
                How to Submit a Cancellation Request
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                You may cancel through any of the following. Please include your
                booking ID, full name, and trek name in your request. We
                acknowledge every request within one business day and share
                cancellation confirmation once processed.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white dark:bg-card rounded-xl p-4 border border-gray-100 dark:border-white/10">
                  <div className="text-primary flex-shrink-0">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Email
                    </p>
                    <a
                      href="mailto:expeditionhappiness07@gmail.com"
                      className="text-xs text-primary hover:underline"
                    >
                      expeditionhappiness07@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-card rounded-xl p-4 border border-gray-100 dark:border-white/10">
                  <div className="text-primary flex-shrink-0">
                    <MessageCircleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      WhatsApp
                    </p>
                    <a
                      href="https://wa.me/918650561564"
                      className="text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +91 86505 61564
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-card rounded-xl p-4 border border-gray-100 dark:border-white/10">
                  <div className="text-primary flex-shrink-0">
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Call Us
                    </p>
                    <a
                      href="tel:+918650561564"
                      className="text-xs text-primary hover:underline"
                    >
                      +91 86505 61564
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Refund Processing ─── */}
      <section className="py-section-sm px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="relative glass-card rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 text-white">
                  <CreditCardIcon className="w-7 h-7" />
                </div>
                <h2 className="font-heading text-display-md font-bold text-foreground mb-4">
                  Refund Processing
                </h2>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>
                    Once your cancellation request is reviewed and the eligible
                    refund amount is confirmed, the refund is initiated within{" "}
                    <strong className="text-foreground">7–10 business days</strong>.
                    The amount is credited back to the original payment method used
                    at the time of booking.
                  </p>
                  <p>
                    Depending on your bank or payment provider, it may take an
                    additional <strong className="text-foreground">3–5 business
                    days</strong> for the refund to reflect in your account. This
                    timeline is outside our direct control but we are happy to
                    assist if there are delays beyond the expected window.
                  </p>
                  <p>
                    You will receive a confirmation email with refund details once
                    the amount has been processed from our end.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Rescheduling Policy ─── */}
      <section className="py-section px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-white dark:bg-card rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                  <RefreshIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading text-display-md font-bold text-foreground">
                    Rescheduling Policy
                  </h2>
                </div>
              </div>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  We understand that plans can change. If you are unable to make
                  it to your booked trek, you may request a{" "}
                  <strong className="text-foreground">
                    one-time reschedule
                  </strong>{" "}
                  to a different batch of the same trek, subject to availability
                  and operational feasibility.
                </p>
                <ul className="space-y-3">
                  {[
                    "Reschedule requests must be made at least 7 days before departure.",
                    "Only one reschedule is permitted per booking.",
                    "Rescheduling is subject to availability on the requested batch and is not guaranteed.",
                    "A nominal rescheduling fee may apply to cover administrative changes.",
                    "Rescheduling to a different trek is not permitted — only batch changes within the same trek.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="text-primary flex-shrink-0 mt-0.5">
                        <CheckCircleIcon className="w-5 h-5" />
                      </div>
                      <span className="text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Cancellation by the Company ─── */}
      <section className="py-section px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase text-accent">
              Our Commitment
            </span>
            <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
              If We Cancel Your Trek
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              Sometimes the mountains make decisions for us. If we need to cancel
              a trek, your safety and financial interests are fully protected.
            </p>
          </FadeUp>

          <StaggerContainer
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12"
            staggerDelay={0.08}
          >
            {COMPANY_CANCELLATION_REASONS.map((reason) => {
              const IconComp = reason.icon;
              return (
                <StaggerItem key={reason.title}>
                  <div className="bg-white dark:bg-card rounded-2xl p-6 border border-gray-100 dark:border-white/10 h-full">
                    <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4 text-red-500">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Options when company cancels */}
          <FadeUp delay={0.15}>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 md:p-10">
              <h3 className="font-heading font-semibold text-foreground text-xl mb-6">
                Your Options When We Cancel
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: RefreshIcon,
                    title: "Reschedule",
                    text: "Move to the next available batch of the same trek at no additional cost.",
                  },
                  {
                    icon: CreditCardIcon,
                    title: "Trek Credit",
                    text: "Receive a full-value credit that can be used for any future trek with us.",
                  },
                  {
                    icon: ArrowRightIcon,
                    title: "Full Refund",
                    text: "Get 100% of your booking amount refunded to your original payment method.",
                  },
                ].map((option) => {
                  const OptIcon = option.icon;
                  return (
                    <div
                      key={option.title}
                      className="bg-white dark:bg-card rounded-xl p-5 border border-gray-100 dark:border-white/10"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
                        <OptIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-semibold text-foreground mb-1">
                        {option.title}
                      </h4>
                      <p className="text-sm text-muted">{option.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── No Show & Early Departure ─── */}
      <section className="py-section px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase text-red-500">
              Important
            </span>
            <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
              No Show &amp; Early Departure
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
              To ensure a smooth experience for all participants, the following
              scenarios are not eligible for any refund.
            </p>
          </FadeUp>

          <StaggerContainer
            className="grid sm:grid-cols-2 gap-5"
            staggerDelay={0.1}
          >
            {NO_SHOW_SCENARIOS.map((scenario) => {
              const ScenIcon = scenario.icon;
              return (
                <StaggerItem key={scenario.title}>
                  <div className="flex items-start gap-4 bg-white dark:bg-card rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0 text-red-500">
                      <ScenIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1">
                        {scenario.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed">
                        {scenario.text}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Non-Refundable Charges ─── */}
      <section className="py-section-sm px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-white dark:bg-card rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
                  <ReceiptTextIcon className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-display-md font-bold text-foreground">
                  Non-Refundable Charges
                </h2>
              </div>
              <p className="text-muted leading-relaxed mb-6">
                Certain costs are incurred upfront on your behalf and may be
                non-recoverable once paid to third parties. These charges will be
                deducted from your refund where applicable:
              </p>
              <ul className="space-y-3">
                {NON_REFUNDABLE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="text-amber-500 flex-shrink-0 mt-0.5">
                      <XCircleIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Important Notes ─── */}
      <section className="py-section px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-display-md font-bold">
                  Important Notes
                </h2>
              </div>
              <ul className="space-y-4">
                {[
                  "Refund eligibility is determined solely by the date the written cancellation request is received by us, not the date of booking or the trek departure date.",
                  "All cancellation and reschedule requests must be submitted in writing through email, WhatsApp, or our official contact channels. Verbal requests over phone are not considered valid for processing.",
                  "We reserve the right to modify this policy at any time. Changes will be communicated via email and the updated policy will be published on this page. The policy in effect at the time of your booking will apply to your cancellation.",
                  "Refunds apply strictly to the trek booking amount paid to us. We are not responsible for any incidental or third-party expenses such as flights, train tickets, personal gear, hotel stays, or travel insurance purchased independently.",
                  "In the event of a dispute, the decision of the company management will be final, subject to applicable consumer protection laws of India.",
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-white/80 text-sm leading-relaxed">
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FAQ Section ─── */}
      <section className="py-section px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <span className="text-sm font-semibold tracking-widest uppercase text-accent">
              FAQ
            </span>
            <h2 className="mt-4 font-heading text-display-lg font-bold text-foreground leading-tight">
              Common Cancellation Questions
            </h2>
          </FadeUp>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
                    openFaq === i
                      ? "bg-primary/5 border border-primary/10"
                      : "bg-white dark:bg-card border border-gray-100 dark:border-white/10"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-heading text-base md:text-lg font-semibold text-foreground pr-4">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                        openFaq === i
                          ? "bg-primary text-white"
                          : "bg-surface text-foreground"
                      }`}
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <div className="px-6 pb-6">
                          <p className="text-muted leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Need Help CTA ─── */}
      <section className="py-section px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 p-10 md:p-14 text-center">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 text-white">
                  <MountainIcon className="w-8 h-8" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                  Need Assistance With Your Booking?
                </h2>
                <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                  Our team is available 7 days a week to help with
                  cancellations, rescheduling, or any questions about your trek.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://wa.me/918650561564"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 bg-white text-emerald-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg"
                  >
                    <MessageCircleIcon className="w-5 h-5" />
                    WhatsApp Support
                  </a>
                  <a
                    href="tel:+918650561564"
                    className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/25 transition-colors"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    Call Us
                  </a>
                  <a
                    href="mailto:expeditionhappiness07@gmail.com"
                    className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-xl border border-white/25 hover:bg-white/25 transition-colors"
                  >
                    <MailIcon className="w-5 h-5" />
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
