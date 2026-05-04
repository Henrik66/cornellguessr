"use client";

import { useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { Location, RoundResult as RoundResultData } from "@/lib/database.types";
import { getActiveLocations, shuffleAndPick } from "@/lib/locations";
import { haversine, computeScore } from "@/lib/scoring";
import { saveGame } from "@/lib/games";
import RoundResultOverlay from "@/components/RoundResult";

const StreetViewPane = dynamic(() => import("@/components/StreetViewPane"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-900 animate-pulse" />,
});

const GuessMap = dynamic(() => import("@/components/GuessMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse" />,
});

const ROUNDS = 5;

interface Guess {
  lat: number;
  lng: number;
}

type Phase = "loading" | "playing" | "revealing" | "done";

interface State {
  phase: Phase;
  locations: Location[];
  currentRound: number;
  currentGuess: Guess | null;
  results: RoundResultData[];
  gameId: string | null;
  error: string | null;
}

type Action =
  | { type: "LOADED"; locations: Location[] }
  | { type: "SET_GUESS"; guess: Guess }
  | { type: "SUBMIT" }
  | { type: "NEXT_ROUND" }
  | { type: "GAME_SAVED"; gameId: string }
  | { type: "ERROR"; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADED":
      return { ...state, phase: "playing", locations: action.locations };
    case "SET_GUESS":
      return { ...state, currentGuess: action.guess };
    case "SUBMIT": {
      if (!state.currentGuess) return state;
      const loc = state.locations[state.currentRound];
      const dist = haversine(state.currentGuess, { lat: loc.lat, lng: loc.lng });
      const score = computeScore(dist);
      const result: RoundResultData = {
        location_id: loc.id,
        guess_lat: state.currentGuess.lat,
        guess_lng: state.currentGuess.lng,
        score,
        distance_m: dist,
      };
      return {
        ...state,
        phase: "revealing",
        results: [...state.results, result],
        currentGuess: null,
      };
    }
    case "NEXT_ROUND": {
      const next = state.currentRound + 1;
      if (next >= ROUNDS) return { ...state, phase: "done" };
      return { ...state, phase: "playing", currentRound: next };
    }
    case "GAME_SAVED":
      return { ...state, gameId: action.gameId };
    case "ERROR":
      return { ...state, phase: "loading", error: action.message };
    default:
      return state;
  }
}

const initial: State = {
  phase: "loading",
  locations: [],
  currentRound: 0,
  currentGuess: null,
  results: [],
  gameId: null,
  error: null,
};

export default function GamePage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    getActiveLocations()
      .then((locs) => {
        if (locs.length < ROUNDS) {
          dispatch({ type: "ERROR", message: "Not enough locations in database." });
          return;
        }
        dispatch({ type: "LOADED", locations: shuffleAndPick(locs, ROUNDS) });
      })
      .catch(() =>
        dispatch({ type: "ERROR", message: "Failed to load locations." })
      );
  }, []);

  // Save game when done
  useEffect(() => {
    if (state.phase === "done" && state.results.length === ROUNDS && !state.gameId) {
      saveGame(state.results)
        .then((g) => dispatch({ type: "GAME_SAVED", gameId: g.id }))
        .catch(console.error);
    }
  }, [state.phase, state.results, state.gameId]);

  // Navigate to result once saved
  useEffect(() => {
    if (state.phase === "done" && state.gameId) {
      router.push(`/result/${state.gameId}`);
    }
  }, [state.phase, state.gameId, router]);

  const handleGuess = useCallback((guess: Guess) => {
    dispatch({ type: "SET_GUESS", guess });
  }, []);

  if (state.phase === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        {state.error ? (
          <p className="text-red-400">{state.error}</p>
        ) : (
          <p className="text-gray-400 animate-pulse">Loading game…</p>
        )}
      </div>
    );
  }

  const loc = state.locations[state.currentRound];
  const lastResult = state.results[state.results.length - 1];
  const isRevealing = state.phase === "revealing";
  const revealData = isRevealing && lastResult
    ? {
        guess: { lat: lastResult.guess_lat, lng: lastResult.guess_lng },
        actual: { lat: loc.lat, lng: loc.lng },
      }
    : null;

  const totalScore = state.results.reduce((s, r) => s + r.score, 0);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <h1 className="text-white font-bold text-sm tracking-wide">CornellGuessr</h1>
        <div className="flex items-center gap-3">
          {/* Round dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: ROUNDS }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < state.results.length
                    ? "bg-red-500"
                    : i === state.currentRound && state.phase !== "done"
                    ? "bg-white"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-white font-semibold text-sm">
            {totalScore.toLocaleString()} pts
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Street View — left 60% */}
        <div className="flex-[6] relative">
          <StreetViewPane location={loc} />
        </div>

        {/* Guess map — right 40% */}
        <div className="flex-[4] relative border-l border-gray-800">
          <GuessMap
            onGuess={handleGuess}
            reveal={revealData}
            disabled={isRevealing}
          />
          {!isRevealing && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={() => dispatch({ type: "SUBMIT" })}
                disabled={!state.currentGuess}
                className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-red-600 text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
              >
                Submit guess
              </button>
            </div>
          )}
          {isRevealing && lastResult && (
            <RoundResultOverlay
              locationName={loc.name}
              distanceMeters={lastResult.distance_m}
              score={lastResult.score}
              round={state.currentRound + 1}
              totalRounds={ROUNDS}
              onNext={() => dispatch({ type: "NEXT_ROUND" })}
              isLast={state.currentRound + 1 === ROUNDS}
            />
          )}
        </div>
      </div>
    </div>
  );
}
