import { ClientCase } from "./case";

export interface Sales {
  id: number;
  user_id: number;
  case_id: number;
  client_case?: ClientCase | null;
  sale_date: string;
  year: number;
  month: number;
  amount: number;
  tax_amount?: number | null;
  total_amount: number;
  working_hours?: number | null;
  hourly_rate?: number | null;
  payment_due_date?: string | null;
  payment_date?: string | null;
  is_paid?: boolean | null;
  notes?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaleInput {
  case_id: number;
  sale_date: string;
  amount: number;
  tax_amount?: number;
  working_hours?: number;
  hourly_rate?: number;
  payment_due_date?: string;
  payment_date?: string;
  is_paid?: boolean;
  notes?: string;
}

export interface PaginatedSalesResponse {
  data: Sales[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}
