import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const csrf = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("amino_csrf="))
      ?.split("=")[1];
    if (csrf) config.headers.set("x-csrf-token", decodeURIComponent(csrf));
  }
  return config;
});

export default api;
