import {
  mockDashboardSummary,
  type DashboardSummary,
} from "../data/dashboardSummary";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return mockDashboardSummary;
}