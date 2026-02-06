import { apiClient } from "./api-client";

class TokenService {
  private static token: string | null = null;

  static setToken(tk: string) {
    this.token = tk;
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${tk}`;
    localStorage.setItem("token", tk);
  }

  static getToken(): string | null {
    if (this.token) return this.token;
    this.token = localStorage.getItem("token");
    if (this.token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    delete apiClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

export { TokenService };
