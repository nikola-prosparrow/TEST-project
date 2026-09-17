"use client";

import { useEffect, useState } from "react";

const OWNER = "nikola-prosparrow";
const REPO = "TEST-project";
const WORKFLOW = "ci.yml";

type Job = {
  name: string;
  status: string;
  conclusion: string | null;
  html_url: string;
};

type RunSummary = {
  id: number;
  status: string;
  conclusion: string | null;
  html_url: string;
  head_commit: { message: string } | null;
  head_branch: string;
  run_started_at: string;
};

type State =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | { phase: "ready"; run: RunSummary; jobs: Job[] };

function statusColor(conclusion: string | null, status: string) {
  if (status !== "completed") return "#F2884A"; // in progress
  if (conclusion === "success") return "#1FA97A";
  if (conclusion === "failure") return "#D6417F";
  return "#A1A1A6";
}

function statusLabel(conclusion: string | null, status: string) {
  if (status !== "completed") return "U toku…";
  if (conclusion === "success") return "Prošao";
  if (conclusion === "failure") return "Pao";
  return conclusion ?? status;
}

export function TestStatusDashboard() {
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const runsRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=1&branch=main`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!runsRes.ok) throw new Error(`GitHub API ${runsRes.status}`);
        const runsData = await runsRes.json();
        const run: RunSummary | undefined = runsData.workflow_runs?.[0];
        if (!run) throw new Error("Nema CI run-ova još");

        const jobsRes = await fetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${run.id}/jobs`,
          { headers: { Accept: "application/vnd.github+json" } },
        );
        if (!jobsRes.ok) throw new Error(`GitHub API ${jobsRes.status}`);
        const jobsData = await jobsRes.json();

        if (!cancelled) {
          setState({ phase: "ready", run, jobs: jobsData.jobs ?? [] });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            phase: "error",
            message: err instanceof Error ? err.message : "Nepoznata greška",
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-zinc-900">CI status (poslednji run na main)</h3>
        <a
          href={`https://github.com/${OWNER}/${REPO}/actions`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[#D6417F]"
        >
          Otvori GitHub Actions →
        </a>
      </div>

      {state.phase === "loading" && <p className="text-sm text-zinc-500">Učitavam…</p>}

      {state.phase === "error" && (
        <p className="text-sm text-zinc-500">
          Ne mogu da učitam status ({state.message}). Proveri direktno na GitHub-u.
        </p>
      )}

      {state.phase === "ready" && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: statusColor(state.run.conclusion, state.run.status) }}
            />
            <span className="text-sm font-semibold text-zinc-900">
              {statusLabel(state.run.conclusion, state.run.status)}
            </span>
            <span className="text-xs text-zinc-500">
              {state.run.head_commit?.message?.split("\n")[0] ?? "—"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {state.jobs.map((job) => (
              <a
                key={job.name}
                href={job.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm"
              >
                <span className="font-medium text-zinc-800">{job.name}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: statusColor(job.conclusion, job.status) }}
                >
                  {statusLabel(job.conclusion, job.status)}
                </span>
              </a>
            ))}
          </div>

          <a
            href={state.run.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs text-zinc-400"
          >
            Detalji run-a →
          </a>
        </div>
      )}
    </div>
  );
}
