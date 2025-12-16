import { createContext, useContext, useState, useEffect } from "react";
import { api, setAuth } from "../api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  // ✅ Read user from localStorage on app start
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("auth_user") || "null")
  );

  // ✅ Reapply token on page refresh
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setAuth(token);
    }
  }, []);

  const login = async (phone, password) => {
    const { data } = await api.post("/auth/login", { phone, password });

    // ✅ Attach token to axios
    setAuth(data.token);

    setUser(data);

    // ✅ Save in localStorage
    localStorage.setItem("auth_user", JSON.stringify(data));
    localStorage.setItem("auth_token", data.token);

    return data;
  };

  const register = async (phone, full_name, password, avatar = "") => {
    const { data } = await api.post("/auth/register", {
      phone,
      full_name,
      password,
      avatar, // ✅ Support avatar on signup
    });

    // ✅ FIXED — Add missing token setting
    setAuth(data.token);
    setUser(data);

    // ✅ FIXED — Save token after register
    localStorage.setItem("auth_user", JSON.stringify(data));
    localStorage.setItem("auth_token", data.token);

    return data;
  };

  return (
    <AuthCtx.Provider value={{ user, login, register }}>
      {children}
    </AuthCtx.Provider>
  );
}
