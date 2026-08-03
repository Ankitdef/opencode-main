import Link from "next/link";
import { treks } from "@/data/treks";
import TrekDetailClient from "./TrekDetailClient";

export function generateStaticParams() {
  return treks.map((trek) => ({ id: trek.slug }));
}

export default async function TrekDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trek = treks.find((t) => t.slug === id);

  if (!trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Trek Not Found</h1>
          <Link href="/treks" className="text-emerald-600 hover:underline">
            Back to All Treks
          </Link>
        </div>
      </div>
    );
  }

  return <TrekDetailClient trek={trek} />;
}