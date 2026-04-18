import type { GradingResult } from "@/lib/types";

export function ScoreBar({ result }: { result: GradingResult }) {
  const pct = Math.round((result.score / result.maxScore) * 100);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">採点結果</h3>
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {result.score} / {result.maxScore}
          <span className="ml-2 text-sm font-medium text-zinc-500">
            ({pct}%)
          </span>
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {result.feedback}
      </p>
      {result.criteria && result.criteria.length > 0 && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.criteria.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <dt className="flex items-center justify-between text-sm font-semibold">
                <span>{c.name}</span>
                <span className="text-zinc-500">
                  {c.score} / {c.max}
                </span>
              </dt>
              <dd className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                {c.comment}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
