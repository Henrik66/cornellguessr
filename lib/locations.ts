import { supabase } from "./supabase";
import type { Location } from "./database.types";

export async function getActiveLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("active", true);
  if (error) throw error;
  return data as Location[];
}

export async function getLocationById(id: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Location;
}

export async function getAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Location[];
}

export async function upsertLocation(
  loc: Omit<Location, "id" | "created_at"> & { id?: string }
): Promise<Location> {
  const { data, error } = await supabase
    .from("locations")
    .upsert(loc)
    .select()
    .single();
  if (error) throw error;
  return data as Location;
}

export async function toggleLocation(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from("locations")
    .update({ active })
    .eq("id", id);
  if (error) throw error;
}

export function shuffleAndPick(locations: Location[], count = 5): Location[] {
  const copy = [...locations];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
