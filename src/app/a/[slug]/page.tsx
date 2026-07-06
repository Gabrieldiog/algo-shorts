import { notFound } from "next/navigation";
import { roster, rosterEntry } from "@/lib/algorithms";
import { Visualizer } from "@/components/player/Visualizer";
import { PathViz } from "@/components/path/PathViz";

// Pre-renderiza uma pagina por algoritmo: com static export, o site inteiro
// vira HTML pronto (sem runtime), hospedavel em qualquer lugar.
export function generateStaticParams() {
  return roster.map((r) => ({ slug: r.slug }));
}

export const dynamicParams = false;

export default async function AlgoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = rosterEntry(slug);
  if (!entry) notFound();
  if (entry.category === "path") return <PathViz slug={slug} />;
  return <Visualizer slug={slug} />;
}
