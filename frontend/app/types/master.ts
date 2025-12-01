// マスターデータの基本インターフェース
interface MasterDataBase {
  id: number;
  name: string;
  display_order: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 案件ステータス
export interface CaseStatus extends MasterDataBase {
  color?: string | null;
}

// 案件優先度
export interface CasePriority extends MasterDataBase {
  color?: string | null;
}

// 支払いタイプ
export interface PaymentType extends MasterDataBase {
}
