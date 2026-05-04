import { createServerClient } from "@/lib/supabase-server";
import Leaderboard from "@/components/Leaderboard";
import Link from "next/link";

export const metadata = { title: "Leaderboard — CornellGuessr" };

export default async function LeaderboardPage() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-xs text-red-600 font-semibold uppercase tracking-widest">
              ← CornellGuessr
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mt-1">Leaderboard</h1>
          </div>
          <Link
            href="/game"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            Play now
          </Link>
        </div>
        <Leaderboard currentUserId={userId} />
      </div>
    </div>
  );
}
