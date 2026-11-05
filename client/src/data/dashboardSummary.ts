export type OrderStatus =
  | "received"
  | "in-progress"
  | "ready-for-pickup"
  | "completed"
  | "canceled";

export interface SummaryCount {
  label: string;
  value: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  total: number;
  pickupTime: string;
  status: OrderStatus;
}

export interface RecentProduct {
  id: string;
  name: string;
  availability: "available" | "unavailable";
}

export interface DashboardSummary {
  counts: SummaryCount[];
  recentOrders: RecentOrder[];
  recentProducts: RecentProduct[];
}

// Sample data only. Replace with real backend data in BPK-57.
export const mockDashboardSummary: DashboardSummary = {
  counts: [
    { label: "Today's pickups", value: 2 },
    { label: "Pending orders", value: 3 },
    { label: "Catering requests", value: 1 },
    { label: "Sold-out items", value: 1 },
  ],
  recentOrders: [
    {
      id: "ORD-1001",
      customerName: "Sample Customer A",
      total: 24.0,
      pickupTime: "Sat 11:00 AM",
      status: "received",
    },
    {
      id: "ORD-1002",
      customerName: "Sample Customer B",
      total: 16.5,
      pickupTime: "Sat 12:30 PM",
      status: "in-progress",
    },
    {
      id: "ORD-1003",
      customerName: "Sample Customer C",
      total: 40.0,
      pickupTime: "Sun 10:00 AM",
      status: "ready-for-pickup",
    },
  ],
  recentProducts: [
    { id: "prod-a", name: "Sample Product A", availability: "available" },
    { id: "prod-b", name: "Sample Product B", availability: "available" },
    { id: "prod-c", name: "Sample Product C", availability: "unavailable" },
  ],
};