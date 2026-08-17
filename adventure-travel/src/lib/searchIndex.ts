import { treks } from "@/data/treks";
import { courses } from "@/data/courses";

export interface SearchItem {
  name: string;
  sub: string;
  href: string;
}

export const searchIndex: SearchItem[] = [
  ...treks.map((t) => ({ name: t.name, sub: `${t.region} · ${t.difficulty}`, href: `/treks/${t.slug}` })),
  ...courses.map((c) => ({ name: c.name, sub: `${c.location} · ${c.type}`, href: `/courses/${c.slug}` })),
];

export function searchAll(q: string): SearchItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return searchIndex.filter((i) => `${i.name} ${i.sub}`.toLowerCase().includes(needle)).slice(0, 6);
}
