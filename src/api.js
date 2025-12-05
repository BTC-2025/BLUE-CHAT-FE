import axios from "axios";

// ✅ FIX BASE URL (correct backend port)
const API_BASE = "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE,
});

// ✅ attach token on login/register OR page reload
export const setAuth = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
