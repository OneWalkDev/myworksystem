import { apiClient } from "./client";

export const authApi = {
  async login(email: string, password: string) {
    return apiClient.post("/login", { email, password });
  },

  async logout() {
    return apiClient.post("/logout", {});
  },
};
