import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// export const BASE_URL = "http://localhost:8080/api";
export const BASE_URL = "https://falaqnashr.uz/api";

export function Request<T = unknown>(
  url: string,
  method: AxiosRequestConfig["method"],
  data?: unknown,
  isSendHeaderAuthorization: boolean = false
): Promise<AxiosResponse<T>> {
  const headers: Record<string, string> = {};

  if (isSendHeaderAuthorization) {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return axios({
    baseURL: BASE_URL,
    url,
    method,
    data,
    headers,
  });
}
