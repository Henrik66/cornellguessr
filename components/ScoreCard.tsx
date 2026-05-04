"use client";

import { useState } from "react";
import type { RoundResult } from "@/lib/database.types";

interface Props {
  gameId: string;
  totalScore: number;
  rounds: RoundResult[];
  locationNames: Record<string, string>;
  onPlayAgain: () => void;
  onSaveScore?: () => void;
  isSaved?: boolean;
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

export default function ScoreCard({
  gameId,
  totalScore,
  rounds,
  locationNames,
  onPlayAgain,
  onSaveScore,
  isSaved,
}: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/result/${gameId}`
      : `/result/${gameId}`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-1">
            CornellGuessr
          </h1>
          <p className="text-5xl font-black text-gray-900">
            {totalScore.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm mt-1">out of 25,000 points</p>
        </div>

        <div className="space-y-2 mb-6">
          {rounds.map((r, i) => (
            <div
              key={r.location_id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5"
            >
              <div>
                <span className="text-xs text-gray-400 mr-2">#{i + 1}</span>
                <span className="text-sm font-medium text-gray-700">
                  {locationNames[r.location_id] ?? "Unknown"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-red-600">
                  {r.score.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {formatDistance(r.distance_m)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {copied ? "Link copied!" : "Share result"}
          </button>
          {onSaveScore && !isSaved && (
            <button
              onClick={onSaveScore}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Save to leaderboard
            </button>
          )}
          {isSaved && (
            <p className="text-center text-sm text-green-600 font-medium">
              Score saved to leaderboard!
            </p>
          )}
          <button
            onClick={onPlayAgain}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
