import { CaseStatus, CasePriority, PaymentType } from "./master";

// 案件データ
export interface ClientCase {
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  client_company?: string | null;
  budget?: number | null;
  actual_amount?: number | null;
  payment_type_id?: number | null;
  hourly_rate?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  actual_start_date?: string | null;
  actual_end_date?: string | null;
  status_id?: number | null;
  priority_id?: number | null;
  tech_stack?: string[] | null;
  tags?: string[] | null;
  notes?: string | null;
  contract_file_path?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
  // リレーション（APIレスポンスに含まれる場合）
  status?: CaseStatus | null;
  priority?: CasePriority | null;
  payment_type?: PaymentType | null;
}

// 案件作成・更新用のデータ
export interface ClientCaseInput {
  name: string;
  description?: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_company?: string;
  budget?: number;
  actual_amount?: number;
  payment_type_id?: number;
  payment_type?: PaymentType;
  hourly_rate?: number;
  start_date?: string;
  end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status_id?: number;
  status?: CaseStatus;
  priority_id?: number;
  priority?: CasePriority;
  tech_stack?: string[];
  tags?: string[];
  notes?: string;
  contract_file_path?: string;
}
