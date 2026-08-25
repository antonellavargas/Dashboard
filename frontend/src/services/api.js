import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export default api;