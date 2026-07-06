import { notFound } from "next/navigation";
import { rosterEntry } from "@/lib/algorithms";
import { Visualizer } from "@/components/player/Visualizer";
import { PathViz } from "@/components/path/PathViz";

export default async function AlgoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = rosterEntry(slug);
  if (!entry) notFound();
  if (entry.category === "path") return <PathViz slug={slug} />;
  return <Visualizer slug={slug} />;
}
