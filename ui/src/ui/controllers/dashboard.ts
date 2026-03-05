import type { AgentsState } from "./agents";
import type { CronState } from "./cron";
import type { SessionsState } from "./sessions";
import { loadAgents } from "./agents";
import { loadCronJobs, loadCronStatus } from "./cron";
import { loadSessions } from "./sessions";

export type DashboardState = AgentsState & CronState & SessionsState;

export async function loadDashboard(state: DashboardState) {
  if (!state.client || !state.connected) return;
  await Promise.all([
    loadAgents(state),
    loadCronJobs(state),
    loadCronStatus(state),
    loadSessions(state),
  ]);
}
