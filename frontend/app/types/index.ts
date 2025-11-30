export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CaseStatistics {
  total: number;
  by_status: Record<string, number>;
  in_progress: number;
  completed: number;
}
