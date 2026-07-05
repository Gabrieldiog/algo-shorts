import { notFound } from "next/navigation";
import { rosterEntry } from "@/lib/algorithms";
import { Visualizer } from "@/components/player/Visualizer";

export default async function AlgoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!rosterEntry(slug)) notFound();
  return <Visualizer slug={slug} />;
}
