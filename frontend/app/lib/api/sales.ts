import { PaginatedSalesResponse, Sales, SaleInput } from "@/app/types/sale";
import { apiClient } from "./client";

interface SaleSearchParams {
  page?: number;
  per_page?: number;
  name?: string;
  sale_date_from?: string;
  sale_date_to?: string;
}

export const salesApi = {
  async getSales(
    token: string,
    params?: SaleSearchParams
  ): Promise<PaginatedSalesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params?.name)
      queryParams.append("name", params.name.toString());
    if (params?.sale_date_from)
      queryParams.append("sale_date_from", params.sale_date_from);
    if (params?.sale_date_to)
      queryParams.append("sale_date_to", params.sale_date_to);

    const endpoint = `/sales${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiClient.get<PaginatedSalesResponse>(endpoint, token);
  },

  async getSale(token: string, id: number): Promise<Sales> {
    return apiClient.get<Sales>(`/sales/${id}`, token);
  },

  async createSale(token: string, data: SaleInput): Promise<Sales> {
    return apiClient.post<Sales>("/sales", data, token);
  },

  async updateSale(
    token: string,
    id: number,
    data: SaleInput
  ): Promise<Sales> {
    return apiClient.patch<Sales>(`/sales/${id}`, data, token);
  },

  async deleteSale(token: string, id: number): Promise<void> {
    return apiClient.delete<void>(`/sales/${id}`, token);
  },
};
