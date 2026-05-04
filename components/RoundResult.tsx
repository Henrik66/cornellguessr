interface Props {
  locationName: string;
  distanceMeters: number;
  score: number;
  round: number;
  totalRounds: number;
  onNext: () => void;
  isLast: boolean;
}

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

export default function RoundResult({
  locationName,
  distanceMeters,
  score,
  round,
  totalRounds,
  onNext,
  isLast,
}: Props) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-6 z-20 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl p-5 w-80 pointer-events-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Round {round} / {totalRounds}
        </p>
        <h2 className="text-lg font-bold text-gray-900 mb-3">{locationName}</h2>
        <div className="flex gap-4 mb-4">
          <div className="flex-1 text-center bg-gray-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-gray-800">
              {formatDistance(distanceMeters)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">distance</p>
          </div>
          <div className="flex-1 text-center bg-red-50 rounded-xl py-3">
            <p className="text-2xl font-bold text-red-600">{score.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">points</p>
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isLast ? "See Final Score" : "Next Round"}
        </button>
      </div>
    </div>
  );
}
