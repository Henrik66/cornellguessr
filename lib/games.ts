import { supabase } from "./supabase";
import type { Game, RoundResult } from "./database.types";

export async function saveGame(
  rounds: RoundResult[],
  userId?: string
): Promise<Game> {
  const total_score = rounds.reduce((sum, r) => sum + r.score, 0);
  const { data, error } = await supabase
    .from("games")
    .insert({ user_id: userId ?? null, total_score, rounds })
    .select()
    .single();
  if (error) throw error;
  return data as Game;
}

export async function getGame(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Game;
}

