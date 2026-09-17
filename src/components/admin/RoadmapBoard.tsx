import { roadmapNow, roadmapNext, roadmapLater, wontHave, type RoadmapItem } from "@/data/roadmap";

function RoadmapColumn({
  title,
  subtitle,
  items,
  accent,
}: {
  title: string;
  subtitle: string;
  items: RoadmapItem[];
  accent: string;
}) {
  return (
    <div className="flex-1 min-w-[260px]">
      <div className="mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900">{title}</h3>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="inline-block rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                style={{ background: accent }}
              >
                {item.id}
              </span>
              <span className="text-[11px] text-zinc-400">{item.jtbd.join(", ")}</span>
            </div>
            <div className="text-sm font-semibold text-zinc-900 mb-1">{item.title}</div>
            <p className="text-xs leading-relaxed text-zinc-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoadmapBoard() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6">
        <RoadmapColumn title="Now" subtitle="Radimo sad — Must-have" items={roadmapNow} accent="#D6417F" />
        <RoadmapColumn title="Next" subtitle="Posle Now — Should-have" items={roadmapNext} accent="#F2884A" />
        <RoadmapColumn title="Later" subtitle="Kad ima trakcije — Could-have" items={roadmapLater} accent="#7A3596" />
      </div>
      <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">Won&apos;t-have (za sada)</h4>
        <ul className="text-xs text-zinc-600 list-disc list-inside space-y-1">
          {wontHave.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
