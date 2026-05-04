"use client";

import { useState, useEffect } from "react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/games";

interface Props {
  currentUserId?: string;
}

type Filter = "all" | "week" | "today";

export default function Leaderboard({ currentUserId }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLeaderboard(filter)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [filter]);

  const tabs: { label: string; value: Filter }[] = [
    { label: "All time", value: "all" },
    { label: "This week", value: "week" },
    { label: "Today", value: "today" },
  ];

  const userEntry = currentUserId
    ? entries.find((e) => e.user_id === currentUserId)
    : null;
  const userRank = userEntry
    ? entries.indexOf(userEntry) + 1
    : null;
  const showPinned = userRank !== null && userRank > 50;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No scores yet.</div>
      ) : (
        <div className="space-y-1">
          {entries.slice(0, 50).map((entry, idx) => {
            const isCurrentUser = entry.user_id === currentUserId;
            return (
              <div
                key={entry.id}
                className={`flex items-center px-4 py-3 rounded-xl ${
                  isCurrentUser ? "bg-red-50 border border-red-200" : "bg-white"
                }`}
              >
                <span className="w-8 text-sm font-bold text-gray-400">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {entry.display_name ?? "Anonymous"}
                </span>
                <span className="text-sm font-bold text-red-600">
                  {entry.total_score.toLocaleString()}
                </span>
              </div>
            );
          })}
          {showPinned && userEntry && (
            <>
              <div className="text-center py-1 text-xs text-gray-400">•••</div>
              <div className="flex items-center px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <span className="w-8 text-sm font-bold text-gray-400">
                  {userRank}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {userEntry.display_name ?? "You"}
                </span>
                <span className="text-sm font-bold text-red-600">
                  {userEntry.total_score.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
