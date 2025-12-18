import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/auth";

function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");

      // Check if it's null, undefined, or "undefined" string
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user"); // Clean up invalid data
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginHandler = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);

      try {
        const data = await login(email, password);

        localStorage.setItem("token", data.authToken || data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        // line to navigate to dashboard after successful login...
        navigate("/dashboard");

        return { success: true, user: data.user };
      } catch (err) {
        setError(err.message);
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const signupHandler = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      await signup(userData);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  return {
    user,
    loading,
    error,
    login: loginHandler,
    signup: signupHandler,
    logout,
    isAuthenticated: !!user,
  };
}
export default useAuth;
