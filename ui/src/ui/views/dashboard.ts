import { html, nothing } from "lit";

import { formatMs } from "../format";
import { formatCronSchedule, formatNextRun } from "../presenter";
import type {
  AgentsListResult,
  CronJob,
  CronStatus,
  GatewaySessionRow,
  SessionsListResult,
} from "../types";

export type DashboardSubView = "tasks" | "pipeline" | "calendar" | "monitor";

export type DashboardProps = {
  subView: DashboardSubView;
  taskFilter: string;
  connected: boolean;
  agentsLoading: boolean;
  agentsList: AgentsListResult | null;
  agentsError: string | null;
  sessionsLoading: boolean;
  sessionsResult: SessionsListResult | null;
  sessionsError: string | null;
  cronLoading: boolean;
  cronJobs: CronJob[];
  cronStatus: CronStatus | null;
  cronError: string | null;
  onSubViewChange: (v: DashboardSubView) => void;
  onTaskFilterChange: (f: string) => void;
  onRefresh: () => void;
};

const SUB_VIEWS: { key: DashboardSubView; label: string }[] = [
  { key: "tasks", label: "Tasks Board" },
  { key: "pipeline", label: "Pipeline" },
  { key: "calendar", label: "Calendar" },
  { key: "monitor", label: "Agent Monitor" },
];

type TaskStatus = "active" | "pending" | "done" | "failed";

function classifySession(s: GatewaySessionRow): TaskStatus {
  if (s.abortedLastRun) return "failed";
  const ageMs = s.updatedAt ? Date.now() - s.updatedAt : Infinity;
  if (ageMs < 5 * 60_000) return "active";
  if (s.systemSent) return "done";
  return "pending";
}

function renderTaskBoard(props: DashboardProps) {
  const sessions = props.sessionsResult?.sessions ?? [];
  const filter = props.taskFilter.toLowerCase().trim();
  const filtered = filter
    ? sessions.filter(
        (s) =>
          (s.key ?? "").toLowerCase().includes(filter) ||
          (s.label ?? "").toLowerCase().includes(filter) ||
          (s.displayName ?? "").toLowerCase().includes(filter) ||
          (s.subject ?? "").toLowerCase().includes(filter),
      )
    : sessions;

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: "active", label: "In Progress", color: "var(--color-accent, #6366f1)" },
    { status: "pending", label: "Pending", color: "var(--color-muted, #8b8fa8)" },
    { status: "done", label: "Done", color: "var(--color-success, #22c55e)" },
    { status: "failed", label: "Failed", color: "var(--color-danger, #ef4444)" },
  ];

  const byStatus = new Map<TaskStatus, GatewaySessionRow[]>();
  for (const col of columns) byStatus.set(col.status, []);
  for (const s of filtered) {
    const st = classifySession(s);
    byStatus.get(st)?.push(s);
  }

  if (props.sessionsLoading && sessions.length === 0) {
    return html`<div class="muted" style="margin-top: 12px;">Loading sessions…</div>`;
  }

  if (!props.connected) {
    return html`<div class="muted" style="margin-top: 12px;">Not connected to gateway.</div>`;
  }

  return html`
    <div>
      <label class="field" style="max-width: 320px; margin-bottom: 16px;">
        <span>Filter</span>
        <input
          .value=${props.taskFilter}
          placeholder="Filter by key, label, or subject…"
          @input=${(e: Event) =>
            props.onTaskFilterChange((e.target as HTMLInputElement).value)}
        />
      </label>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
        ${columns.map(
          (col) => html`
            <div class="card" style="min-height: 200px;">
              <div
                class="card-title"
                style="color: ${col.color}; border-bottom: 2px solid ${col.color}; padding-bottom: 8px; margin-bottom: 12px;"
              >
                ${col.label}
                <span
                  style="font-weight: normal; font-size: 0.75rem; margin-left: 8px;"
                >(${byStatus.get(col.status)?.length ?? 0})</span>
              </div>
              ${byStatus.get(col.status)?.length === 0
                ? html`<div class="muted" style="font-size: 0.8rem;">No tasks</div>`
                : byStatus.get(col.status)?.map((s) => renderTaskCard(s))}
            </div>
          `,
        )}
      </div>
      ${props.sessionsError
        ? html`<div class="muted" style="margin-top: 8px; color: var(--color-danger);">${props.sessionsError}</div>`
        : nothing}
    </div>
  `;
}

function renderTaskCard(s: GatewaySessionRow) {
  const title = s.label ?? s.displayName ?? s.subject ?? s.key;
  const sub = s.surface ?? s.room ?? s.key;
  const age = s.updatedAt ? formatMs(s.updatedAt) : "—";
  return html`
    <div
      class="list-item"
      style="margin-bottom: 8px; border: 1px solid var(--border-color, #2a2d3e); border-radius: 6px; padding: 8px;"
    >
      <div class="list-title" style="font-size: 0.85rem; font-weight: 600;">${title}</div>
      ${sub !== title
        ? html`<div class="list-sub" style="font-size: 0.75rem;">${sub}</div>`
        : nothing}
      <div
        class="muted"
        style="font-size: 0.7rem; margin-top: 4px;"
      >${age}</div>
      ${s.model
        ? html`<div class="chip-row" style="margin-top: 4px;"><span class="chip" style="font-size: 0.65rem;">${s.model}</span></div>`
        : nothing}
    </div>
  `;
}

function renderPipeline(props: DashboardProps) {
  const sessions = props.sessionsResult?.sessions ?? [];

  if (!props.connected) {
    return html`<div class="muted" style="margin-top: 12px;">Not connected to gateway.</div>`;
  }

  const grouped = new Map<string, GatewaySessionRow[]>();
  for (const s of sessions) {
    const stage = s.subject ?? s.surface ?? s.room ?? "Unassigned";
    if (!grouped.has(stage)) grouped.set(stage, []);
    grouped.get(stage)!.push(s);
  }

  if (grouped.size === 0) {
    return html`<div class="muted" style="margin-top: 12px;">No sessions found. Sessions will appear here organized by subject or surface.</div>`;
  }

  return html`
    <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px;">
      ${Array.from(grouped.entries()).map(
        ([stage, items]) => html`
          <div class="card" style="min-width: 220px; flex-shrink: 0;">
            <div class="card-title">${stage}</div>
            <div class="card-sub">${items.length} session${items.length === 1 ? "" : "s"}</div>
            <div style="margin-top: 12px;">
              ${items.map(
                (s) => html`
                  <div
                    style="padding: 8px; border: 1px solid var(--border-color, #2a2d3e); border-radius: 5px; margin-bottom: 6px;"
                  >
                    <div style="font-size: 0.83rem; font-weight: 600;">
                      ${s.label ?? s.displayName ?? s.key}
                    </div>
                    <div style="font-size: 0.72rem;" class="muted">
                      ${s.updatedAt ? formatMs(s.updatedAt) : "—"}
                    </div>
                    <div class="chip-row" style="margin-top: 4px;">
                      <span class="chip" style="font-size: 0.65rem;">${classifySession(s)}</span>
                    </div>
                  </div>
                `,
              )}
            </div>
          </div>
        `,
      )}
    </div>
  `;
}

function renderCalendar(props: DashboardProps) {
  if (!props.connected) {
    return html`<div class="muted" style="margin-top: 12px;">Not connected to gateway.</div>`;
  }

  if (props.cronLoading && props.cronJobs.length === 0) {
    return html`<div class="muted" style="margin-top: 12px;">Loading scheduled jobs…</div>`;
  }

  return html`
    <section class="card">
      <div class="card-title">Scheduled Jobs</div>
      <div class="card-sub">
        Cron jobs managed by the gateway.
        ${props.cronStatus
          ? html` Next wake: ${formatNextRun(props.cronStatus.nextWakeAtMs ?? null)}.`
          : nothing}
      </div>
      ${props.cronJobs.length === 0
        ? html`<div class="muted" style="margin-top: 12px;">No cron jobs configured.</div>`
        : html`
            <div class="list" style="margin-top: 12px;">
              ${props.cronJobs.map((job) => renderCalendarJob(job))}
            </div>
          `}
      ${props.cronError
        ? html`<div class="muted" style="margin-top: 8px; color: var(--color-danger);">${props.cronError}</div>`
        : nothing}
    </section>
  `;
}

function renderCalendarJob(job: CronJob) {
  return html`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${job.name}</div>
        <div class="list-sub">${formatCronSchedule(job)}</div>
        ${job.description
          ? html`<div class="muted" style="font-size: 0.78rem;">${job.description}</div>`
          : nothing}
      </div>
      <div class="list-meta">
        <div>${formatNextRun(job.state?.nextRunAtMs ?? null)}</div>
        <div class="chip-row" style="margin-top: 4px;">
          <span class="chip">${job.enabled ? "enabled" : "disabled"}</span>
        </div>
      </div>
    </div>
  `;
}

function renderAgentMonitor(props: DashboardProps) {
  if (!props.connected) {
    return html`<div class="muted" style="margin-top: 12px;">Not connected to gateway.</div>`;
  }

  if (props.agentsLoading && !props.agentsList) {
    return html`<div class="muted" style="margin-top: 12px;">Loading agents…</div>`;
  }

  const agents = props.agentsList?.agents ?? [];

  if (agents.length === 0) {
    return html`<div class="muted" style="margin-top: 12px;">No agents found.</div>`;
  }

  const sessions = props.sessionsResult?.sessions ?? [];

  return html`
    <div class="grid grid-cols-2" style="gap: 12px;">
      ${agents.map((agent) => {
        const name = agent.identity?.name ?? agent.name ?? agent.id;
        const emoji = agent.identity?.emoji ?? "🤖";
        const isDefault = agent.id === props.agentsList?.defaultId;
        const agentSessions = sessions.filter(
          (s) => s.key.startsWith(`agent:${agent.id}:`),
        );
        const activeSessions = agentSessions.filter(
          (s) => classifySession(s) === "active",
        ).length;
        const totalSessions = agentSessions.length;

        return html`
          <div class="card">
            <div class="row" style="gap: 10px; align-items: center; margin-bottom: 12px;">
              <div
                style="font-size: 1.5rem; line-height: 1; width: 36px; text-align: center;"
              >${emoji}</div>
              <div>
                <div class="card-title" style="margin-bottom: 2px;">${name}</div>
                <div class="muted" style="font-size: 0.72rem;">
                  ${isDefault ? "Default Agent" : agent.id}
                </div>
              </div>
              <div
                class="statusDot ${activeSessions > 0 ? "ok" : ""}"
                style="margin-left: auto; width: 10px; height: 10px; border-radius: 50%; background: ${activeSessions > 0 ? "var(--color-success, #22c55e)" : "var(--color-muted, #8b8fa8)"};"
              ></div>
            </div>
            <div class="stat-grid">
              <div class="stat">
                <div class="stat-label">Active</div>
                <div class="stat-value">${activeSessions}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Total sessions</div>
                <div class="stat-value">${totalSessions}</div>
              </div>
            </div>
            ${agent.identity?.theme
              ? html`<div class="chip-row" style="margin-top: 8px;">
                  <span class="chip">${agent.identity.theme}</span>
                </div>`
              : nothing}
          </div>
        `;
      })}
    </div>
    ${props.agentsError
      ? html`<div class="muted" style="margin-top: 8px; color: var(--color-danger);">${props.agentsError}</div>`
      : nothing}
  `;
}

export function renderDashboard(props: DashboardProps) {
  const isLoading = props.agentsLoading || props.sessionsLoading || props.cronLoading;

  return html`
    <div>
      <div class="row" style="gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
        ${SUB_VIEWS.map(
          ({ key, label }) => html`
            <button
              class="btn ${props.subView === key ? "primary" : ""}"
              @click=${() => props.onSubViewChange(key)}
            >
              ${label}
            </button>
          `,
        )}
        <button
          class="btn"
          style="margin-left: auto;"
          ?disabled=${isLoading}
          @click=${props.onRefresh}
        >
          ${isLoading ? "Loading…" : "Refresh"}
        </button>
      </div>

      ${props.subView === "tasks" ? renderTaskBoard(props) : nothing}
      ${props.subView === "pipeline" ? renderPipeline(props) : nothing}
      ${props.subView === "calendar" ? renderCalendar(props) : nothing}
      ${props.subView === "monitor" ? renderAgentMonitor(props) : nothing}
    </div>
  `;
}
