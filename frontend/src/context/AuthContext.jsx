import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("dhs_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => sessionStorage.removeItem("dhs_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    sessionStorage.setItem("dhs_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    sessionStorage.setItem("dhs_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    sessionStorage.removeItem("dhs_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
