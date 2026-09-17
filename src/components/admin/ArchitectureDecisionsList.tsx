import { architectureDecisions } from "@/data/architectureDecisions";

export function ArchitectureDecisionsList() {
  return (
    <div className="flex flex-col gap-3">
      {architectureDecisions.map((decision) => (
        <div key={decision.id} className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[11px] font-bold text-white">
              {decision.id}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
              {decision.status === "open" ? "Otvoreno" : "Odlučeno"}
            </span>
          </div>
          <div className="text-sm font-semibold text-zinc-900 mb-1.5">{decision.question}</div>
          <ul className="text-xs text-zinc-600 list-disc list-inside mb-2">
            {decision.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <p className="text-xs text-zinc-700 bg-zinc-50 rounded-md p-2">
            <span className="font-semibold">Preporuka: </span>
            {decision.recommendation}
          </p>
        </div>
      ))}
    </div>
  );
}
