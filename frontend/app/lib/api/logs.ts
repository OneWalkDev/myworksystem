import { ActivityLog } from "@/app/types/log";
import { apiClient } from "./client";

export const logsApi = {
  async getRecentLogs(token: string, limit = 5): Promise<ActivityLog[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await apiClient.get<{ data: ActivityLog[] }>(
      `/logs/recent?${params.toString()}`,
      token
    );
    return response.data;
  },
};
