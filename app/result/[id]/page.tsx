import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import type { Game, Location } from "@/lib/database.types";
import ResultClient from "./ResultClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { data } = await createServerClient()
    .from("games")
    .select("total_score")
    .eq("id", id)
    .single();

  return {
    title: data ? `CornellGuessr — ${data.total_score.toLocaleString()} pts` : "CornellGuessr",
    openGraph: {
      images: [{ url: `/api/og?id=${id}` }],
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;

  const db = createServerClient();
  const { data: game } = await db
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (!game) notFound();

  const locationIds = (game.rounds as Game["rounds"]).map((r) => r.location_id);
  const { data: locations } = await db
    .from("locations")
    .select("id, name")
    .in("id", locationIds);

  const locationNames: Record<string, string> = {};
  (locations ?? []).forEach((l: Pick<Location, "id" | "name">) => {
    locationNames[l.id] = l.name;
  });

  return (
    <ResultClient
      game={game as Game}
      locationNames={locationNames}
    />
  );
}
