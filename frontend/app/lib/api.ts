const API_BASE_URL = "http://localhost:8001/api";

export const api = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async logout() {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  },

  async getCaseStatistics(token: string) {
    const response = await fetch(`${API_BASE_URL}/cases/statistics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getCasePriority(token: string) {
    const response = await fetch(`${API_BASE_URL}/cases/priority`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch case priorities: ${response.statusText}`
      );
    }
    return response.json();
  },

  async getCaseStatus(token: string) {
    const response = await fetch(`${API_BASE_URL}/cases/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch case statuses: ${response.statusText}`);
    }
    return response.json();
  },

  async getPaymentType(token: string) {
    const response = await fetch(`${API_BASE_URL}/cases/payment-type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch payment types: ${response.statusText}`);
    }
    return response.json();
  },

  async getCases(
    token: string,
    params?: {
      page?: number;
      per_page?: number;
      name?: string;
      client_name?: string;
      status_id?: number;
      priority_id?: number;
      start_date_from?: string;
      start_date_to?: string;
    }
  ) {
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

    const url = `${API_BASE_URL}/cases${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cases: ${response.statusText}`);
    }
    return response.json();
  },

  async getCase(token: string, id: number) {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to fetch case: ${response.statusText}`
      );
    }
    return response.json();
  },

  async createCase(token: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to create case: ${response.statusText}`
      );
    }
    return response.json();
  },

  async editCase(token: string, data: any, id: number) {
    const response = await fetch(`${API_BASE_URL}/cases/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || `Failed to create case: ${response.statusText}`
      );
    }
    return response.json();
  },
};
