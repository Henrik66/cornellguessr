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

export interface LeaderboardEntry {
  id: string;
  total_score: number;
  played_at: string;
  display_name: string | null;
  user_id: string | null;
}

export async function getLeaderboard(
  filter: "all" | "week" | "today" = "all",
  limit = 50
): Promise<LeaderboardEntry[]> {
  let query = supabase
    .from("games")
    .select("id, total_score, played_at, user_id, profiles(display_name)")
    .order("total_score", { ascending: false })
    .limit(limit);

  const now = new Date();
  if (filter === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    query = query.gte("played_at", start.toISOString());
  } else if (filter === "week") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    query = query.gte("played_at", start.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    total_score: row.total_score as number,
    played_at: row.played_at as string,
    user_id: row.user_id as string | null,
    display_name: (row.profiles as { display_name: string | null } | null)?.display_name ?? null,
  }));
}
