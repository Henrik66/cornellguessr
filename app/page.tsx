import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getLeaderboard } from "@/lib/games";

export default async function Home() {
  let topScores: { display_name: string | null; total_score: number }[] = [];
  try {
    const entries = await getLeaderboard("all", 3);
    topScores = entries.map((e) => ({
      display_name: e.display_name,
      total_score: e.total_score,
    }));
  } catch {
    // leaderboard is optional on landing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <p className="text-red-200 text-sm font-semibold uppercase tracking-widest mb-3">
          Cornell University
        </p>
        <h1 className="text-6xl font-black text-white mb-4 leading-none">
          Cornell<span className="text-red-300">Guessr</span>
        </h1>
        <p className="text-red-100 text-lg mb-4 leading-relaxed">
          How well do you know Cornell&apos;s campus? Guess locations from Street View panoramas and score points for precision.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 mb-8">
          <span className="text-red-200 text-sm">No Move — more game modes coming soon</span>
        </div>

        <Link
          href="/game"
          className="inline-block bg-white text-red-700 font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:bg-red-50 transition-colors"
        >
          Play now
        </Link>

        <p className="text-red-300 text-sm mt-4">No account required</p>

        {topScores.length > 0 && (
          <div className="mt-14">
            <p className="text-red-300 text-xs font-semibold uppercase tracking-widest mb-3">
              Top scores
            </p>
            <div className="space-y-2">
              {topScores.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-red-300 font-bold text-sm">#{i + 1}</span>
                    <span className="text-white font-medium text-sm">
                      {s.display_name ?? "Anonymous"}
                    </span>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {s.total_score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/leaderboard"
              className="text-red-300 hover:text-white text-sm mt-3 inline-block transition-colors"
            >
              View full leaderboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
