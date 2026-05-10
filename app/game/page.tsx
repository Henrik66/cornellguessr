"use client";

import { useEffect, useReducer, useCallback, useRef, useState } from "react";
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
const ROUND_SECONDS = 60;

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
      const loc = state.locations[state.currentRound];
      const guess = state.currentGuess ?? { lat: loc.lat, lng: loc.lng };
      const dist = haversine(guess, { lat: loc.lat, lng: loc.lng });
      const score = state.currentGuess ? computeScore(dist) : 0;
      const result: RoundResultData = {
        location_id: loc.id,
        guess_lat: guess.lat,
        guess_lng: guess.lng,
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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function GamePage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initial);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Timer — runs only during "playing"
  useEffect(() => {
    if (state.phase !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setSecondsLeft(ROUND_SECONDS);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          dispatch({ type: "SUBMIT" });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.phase, state.currentRound]);

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
  const timerPct = secondsLeft / ROUND_SECONDS;
  const timerUrgent = secondsLeft <= 10;

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-gray-950">
      {/* Street View — full screen */}
      <div className="absolute inset-0">
        <StreetViewPane location={loc} />
      </div>

      {/* Top-left: round indicator */}
      <div className="absolute top-4 left-4 z-20 flex gap-1.5 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded-full transition-colors ${
              i < state.results.length
                ? "bg-red-500"
                : i === state.currentRound && !isRevealing
                ? "bg-white"
                : "bg-white/25"
            }`}
          />
        ))}
      </div>

      {/* Top-left below rounds: score */}
      <div className="absolute top-14 left-4 z-20 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5">
        <span className="text-white font-bold text-sm tabular-nums">
          {totalScore.toLocaleString()} pts
        </span>
      </div>

      {/* Top-center: timer */}
      {!isRevealing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1">
          <div
            className={`px-5 py-1.5 rounded-full font-mono font-bold text-lg tabular-nums transition-colors ${
              timerUrgent
                ? "bg-red-600 text-white animate-pulse"
                : "bg-black/70 backdrop-blur-sm text-white"
            }`}
          >
            {pad(Math.floor(secondsLeft / 60))}:{pad(secondsLeft % 60)}
          </div>
          {/* progress bar */}
          <div className="w-24 h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${timerUrgent ? "bg-red-500" : "bg-white"}`}
              style={{ width: `${timerPct * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom-right: minimap */}
      <div className="absolute bottom-6 right-6 z-20 w-72 h-52 hover:w-96 hover:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group transition-all duration-300 ease-in-out">
        <GuessMap
          onGuess={handleGuess}
          reveal={revealData}
          disabled={isRevealing}
        />
        {/* Submit button inside minimap */}
        {!isRevealing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
            <button
              onClick={() => dispatch({ type: "SUBMIT" })}
              disabled={!state.currentGuess}
              className="px-5 py-2 rounded-xl font-semibold text-sm bg-red-600 text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Submit guess
            </button>
          </div>
        )}
      </div>

      {/* Reveal overlay — full screen, centered */}
      {isRevealing && lastResult && (
        <div className="absolute inset-0 z-30 flex">
          {/* dim the street view side */}
          <div className="flex-1 bg-black/40" />
          {/* Result panel */}
          <div className="w-full max-w-sm flex items-center justify-center p-6">
            <RoundResultOverlay
              locationName={loc.name}
              distanceMeters={lastResult.distance_m}
              score={lastResult.score}
              round={state.currentRound + 1}
              totalRounds={ROUNDS}
              onNext={() => dispatch({ type: "NEXT_ROUND" })}
              isLast={state.currentRound + 1 === ROUNDS}
            />
          </div>
        </div>
      )}
    </div>
  );
}
