"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ScoreCard from "@/components/ScoreCard";
import type { Game } from "@/lib/database.types";

interface Props {
  game: Game;
  locationNames: Record<string, string>;
}

export default function ResultClient({ game, locationNames }: Props) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(!!game.user_id);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const handleSave = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push(`/auth?next=/result/${game.id}`);
      return;
    }
    await supabase
      .from("games")
      .update({ user_id: data.user.id })
      .eq("id", game.id);
    setIsSaved(true);
  };

  return (
    <ScoreCard
      gameId={game.id}
      totalScore={game.total_score}
      rounds={game.rounds}
      locationNames={locationNames}
      onPlayAgain={() => router.push("/game")}
      onSaveScore={!isSaved ? handleSave : undefined}
      isSaved={isSaved}
    />
  );
}
