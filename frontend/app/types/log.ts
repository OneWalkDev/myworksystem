export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  description?: string | null;
  meta?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
}
