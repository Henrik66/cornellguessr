"use client";

import { useRouter } from "next/navigation";
import ScoreCard from "@/components/ScoreCard";
import type { Game } from "@/lib/database.types";

interface Props {
  game: Game;
  locationNames: Record<string, string>;
}

export default function ResultClient({ game, locationNames }: Props) {
  const router = useRouter();

  return (
    <ScoreCard
      gameId={game.id}
      totalScore={game.total_score}
      rounds={game.rounds}
      locationNames={locationNames}
      onPlayAgain={() => router.push("/game")}
    />
  );
}
