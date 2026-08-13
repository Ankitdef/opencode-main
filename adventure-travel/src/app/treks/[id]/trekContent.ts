import type { Trek } from "@/data/treks";

/**
 * Live departure schedule for a trek, derived from the existing `Trek` data.
 *
 * Departure months come from `trek.bestSeason`; the per-departure availability is
 * a deterministic pattern (no real inventory backend exists yet). Dates are built
 * from fixed integers — never `Date.now()` — so server and client render the same
 * markup and there is no hydration mismatch.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type Availability = "available" | "few" | "sold";

export type Departure = {
  id: string;
  label: string;   // "18 Sep – 23 Sep 2026"
  iso: string;     // ISO start date, for prefilling the reservation form
  days: number;
  price: number;
  availability: Availability;
};

export type MonthGroup = {
  key: string;
  month: string;
  year: number;
  note?: string;
  departures: Departure[];
};

const MONTH_NOTES: Record<string, string> = {
  Mar: "🌸 Spring blooms",
  Apr: "🌸 Spring blooms",
  May: "☀ Long clear days",
  Jun: "🌿 Fresh meadows",
  Jul: "🌿 Lush greenery",
  Aug: "🌿 Lush greenery",
  Sep: "🌿 Lush greenery",
  Oct: "⛰ Clearest views",
  Nov: "🌌 Stargazing skies",
  Dec: "❄ Snow trails",
  Jan: "❄ Snow trails",
  Feb: "❄ Snow trails",
};

const AVAIL_CYCLE: Availability[] = ["available", "few", "available", "sold"];

function parseSeasonMonths(bestSeason: string): number[] {
  const tokens = bestSeason.match(/[A-Za-z]{3,}/g) ?? [];
  const idx: number[] = [];
  for (const tok of tokens) {
    const i = MONTHS.findIndex((m) => m.toLowerCase() === tok.slice(0, 3).toLowerCase());
    if (i >= 0) idx.push(i);
  }
  if (idx.length === 0) return [8, 9]; // sensible fallback: Sep–Oct
  if (idx.length === 1) return [idx[0]];
  const start = idx[0];
  const end = idx[1];
  const out: number[] = [];
  let i = start;
  for (let guard = 0; guard < 13; guard++) {
    out.push(i);
    if (i === end) break;
    i = (i + 1) % 12;
  }
  return out;
}

function fmtDayMon(year: number, monthIdx: number, day: number): string {
  const d = new Date(year, monthIdx, day); // fixed inputs → deterministic
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function getDepartures(trek: Trek): MonthGroup[] {
  const months = parseSeasonMonths(trek.bestSeason);
  const groups: MonthGroup[] = [];
  let cycle = 0;
  months.forEach((mIdx) => {
    // Anchor to fixed upcoming years so the list is deterministic:
    // months Aug–Dec sit in 2026, Jan–Jul roll to 2027.
    const year = mIdx >= 7 ? 2026 : 2027;
    const startDays = [8, 22];
    const departures: Departure[] = startDays.map((sd, di) => {
      const startDate = new Date(year, mIdx, sd);
      const endDate = new Date(year, mIdx, sd + (trek.days - 1));
      const availability = AVAIL_CYCLE[cycle++ % AVAIL_CYCLE.length];
      const startLabel = fmtDayMon(year, mIdx, sd);
      const endLabel = `${fmtDayMon(year, mIdx, sd + (trek.days - 1))} ${endDate.getFullYear()}`;
      return {
        id: `${trek.slug}-${year}-${mIdx}-${di}`,
        label: `${startLabel} – ${endLabel}`,
        iso: startDate.toISOString().slice(0, 10),
        days: trek.days,
        price: trek.price,
        availability,
      };
    });
    groups.push({
      key: `${MONTHS[mIdx]}-${year}`,
      month: MONTHS[mIdx],
      year,
      note: MONTH_NOTES[MONTHS[mIdx]],
      departures,
    });
  });
  return groups.slice(0, 6);
}
