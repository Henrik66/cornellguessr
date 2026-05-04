export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type LocationCategory =
  | "landmark"
  | "academic"
  | "residential"
  | "gorge"
  | "collegetown";

export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  difficulty: 1 | 2 | 3;
  lat: number;
  lng: number;
  pano_id: string | null;
  heading: number;
  pitch: number;
  active: boolean;
  created_at: string;
}

export interface RoundResult {
  location_id: string;
  guess_lat: number;
  guess_lng: number;
  score: number;
  distance_m: number;
}

export interface Game {
  id: string;
  user_id: string | null;
  total_score: number;
  rounds: RoundResult[];
  played_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: Location;
        Insert: Omit<Location, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Omit<Location, "id">>;
      };
      games: {
        Row: Game;
        Insert: Omit<Game, "id" | "played_at"> & { id?: string; played_at?: string };
        Update: Partial<Omit<Game, "id">>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at"> & { created_at?: string };
        Update: Partial<Omit<Profile, "id">>;
      };
    };
  };
}
