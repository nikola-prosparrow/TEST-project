import { techDebt } from "@/data/techDebt";

const SEVERITY_STYLE: Record<string, { label: string; className: string }> = {
  high: { label: "Visok", className: "bg-red-100 text-red-700" },
  medium: { label: "Srednji", className: "bg-amber-100 text-amber-700" },
  low: { label: "Nizak", className: "bg-zinc-100 text-zinc-600" },
};

export function TechDebtList() {
  const sorted = [...techDebt].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((item) => {
        const severity = SEVERITY_STYLE[item.severity];
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3">
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${severity.className}`}>
              {severity.label}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-zinc-900">{item.title}</div>
              <p className="text-xs text-zinc-600 mt-0.5">{item.description}</p>
              {item.blocks && (
                <span className="mt-1 inline-block text-[11px] font-medium text-zinc-400">
                  Blokira: {item.blocks}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
