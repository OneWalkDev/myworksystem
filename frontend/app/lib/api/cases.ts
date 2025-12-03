import { apiClient } from "./client";
import type {
  ClientCase,
  ClientCaseInput,
  PaginatedCasesResponse,
  CaseStatus,
  CasePriority,
  PaymentType,
} from "@/app/types";

interface CaseSearchParams {
  page?: number;
  per_page?: number;
  name?: string;
  client_name?: string;
  status_id?: number;
  priority_id?: number;
  start_date_from?: string;
  start_date_to?: string;
}

interface CaseStatistics {
  total_cases: number;
  active_cases: number;
  completed_cases: number;
  total_budget: number;
  total_actual_amount: number;
}

export const casesApi = {
  async getStatistics(token: string): Promise<CaseStatistics> {
    return apiClient.get<CaseStatistics>("/cases/statistics", token);
  },

  async getPriority(token: string): Promise<CasePriority[]> {
    return apiClient.get<CasePriority[]>("/cases/priority", token);
  },

  async getStatus(token: string): Promise<CaseStatus[]> {
    return apiClient.get<CaseStatus[]>("/cases/status", token);
  },

  async getPaymentType(token: string): Promise<PaymentType[]> {
    return apiClient.get<PaymentType[]>("/cases/payment-type", token);
  },

  async getCases(
    token: string,
    params?: CaseSearchParams
  ): Promise<PaginatedCasesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params?.name) queryParams.append("name", params.name);
    if (params?.client_name)
      queryParams.append("client_name", params.client_name);
    if (params?.status_id)
      queryParams.append("status_id", params.status_id.toString());
    if (params?.priority_id)
      queryParams.append("priority_id", params.priority_id.toString());
    if (params?.start_date_from)
      queryParams.append("start_date_from", params.start_date_from);
    if (params?.start_date_to)
      queryParams.append("start_date_to", params.start_date_to);

    const endpoint = `/cases${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PaginatedCasesResponse>(endpoint, token);
  },

  async getCase(token: string, id: number): Promise<ClientCase> {
    return apiClient.get<ClientCase>(`/cases/${id}`, token);
  },

  async createCase(
    token: string,
    data: ClientCaseInput
  ): Promise<ClientCase> {
    return apiClient.post<ClientCase>("/cases", data, token);
  },

  async updateCase(
    token: string,
    id: number,
    data: ClientCaseInput
  ): Promise<ClientCase> {
    return apiClient.patch<ClientCase>(`/cases/${id}`, data, token);
  },

  async deleteCase(token: string, id: number): Promise<void> {
    return apiClient.delete<void>(`/cases/${id}`, token);
  },
};
