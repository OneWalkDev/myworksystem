// 個別にエクスポート（推奨）
export { authApi } from "./auth";
export { casesApi } from "./cases";
export { logsApi } from "./logs";
export { salesApi } from "./sales";
export { apiClient } from "./client";

// 後方互換性のため、既存のapiオブジェクトをエクスポート
import { authApi } from "./auth";
import { casesApi } from "./cases";
import { logsApi } from "./logs";
import { salesApi } from "./sales";

export const api = {
  // 認証
  login: authApi.login.bind(authApi),
  logout: authApi.logout.bind(authApi),

  // 案件統計・マスタデータ
  getCaseStatistics: casesApi.getStatistics.bind(casesApi),
  getCasePriority: casesApi.getPriority.bind(casesApi),
  getCaseStatus: casesApi.getStatus.bind(casesApi),
  getPaymentType: casesApi.getPaymentType.bind(casesApi),
  getRecentLogs: logsApi.getRecentLogs.bind(logsApi),

  // 案件CRUD
  getCases: casesApi.getCases.bind(casesApi),
  getCase: casesApi.getCase.bind(casesApi),
  createCase: casesApi.createCase.bind(casesApi),
  editCase: casesApi.updateCase.bind(casesApi),
  deleteCase: casesApi.deleteCase.bind(casesApi),
};
