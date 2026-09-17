import type { Metadata } from "next";
import { RoadmapBoard } from "@/components/admin/RoadmapBoard";
import { TestStatusDashboard } from "@/components/admin/TestStatusDashboard";
import { TechDebtList } from "@/components/admin/TechDebtList";
import { ArchitectureDecisionsList } from "@/components/admin/ArchitectureDecisionsList";

export const metadata: Metadata = {
  title: "Admin — ProSparrow",
  robots: { index: false, follow: false },
};

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      <p className="text-sm text-zinc-500 mb-4">{subtitle}</p>
      {children}
    </section>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-wide text-[#D6417F]">Interno · nije javno linkovano</p>
          <h1 className="text-2xl font-bold text-zinc-900">ProSparrow — Admin</h1>
          <p className="text-sm text-zinc-500">Roadmap, CI status, tech debt i otvorene arhitektonske odluke.</p>
        </header>

        <Section title="CI status" subtitle="Live status poslednjeg workflow run-a sa GitHub Actions.">
          <TestStatusDashboard />
        </Section>

        <Section title="Roadmap" subtitle="Now / Next / Later, izvedeno iz JTBD prioritizacije.">
          <RoadmapBoard />
        </Section>

        <Section title="Tech debt" subtitle="Poznati kompromisi u trenutnom kodu, sortirano po ozbiljnosti.">
          <TechDebtList />
        </Section>

        <Section title="Arhitektonske odluke" subtitle="Otvorena pitanja koja treba rešiti da bi razvoj nastavio bez ponovnog rada.">
          <ArchitectureDecisionsList />
        </Section>
      </div>
    </div>
  );
}
