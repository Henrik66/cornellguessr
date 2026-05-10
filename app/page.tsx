import Link from "next/link";
export default async function Home() {
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
      </div>
    </div>
  );
}
