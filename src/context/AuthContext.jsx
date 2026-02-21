import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getProfile } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("lifelink_token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem("lifelink_token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();
      setUser(res.data.user);
      setToken(storedToken);
    } catch (err) {
      console.error("Failed to load user:", err);
      localStorage.removeItem("lifelink_token");
      localStorage.removeItem("lifelink_user");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ─── Register (removed setLoading) ───
  const register = async (formData) => {
    setError(null);

    try {
      const res = await registerUser(formData);
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem("lifelink_token", newToken);
      localStorage.setItem("lifelink_user", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, message };
    }
  };

  // ─── Login (removed setLoading) ───
  const login = async (email, password) => {
    setError(null);

    try {
      const res = await loginUser({ email, password });
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem("lifelink_token", newToken);
      localStorage.setItem("lifelink_user", JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("lifelink_token");
    localStorage.removeItem("lifelink_user");
    setUser(null);
    setToken(null);
    setError(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      localStorage.setItem("lifelink_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    clearError,
    loadUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;