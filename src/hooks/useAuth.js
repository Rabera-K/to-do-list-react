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
        //debug
        console.log("Login response:", data);

        const token = data.authToken;
        const userId = data.user_id;

        if (!token || !userId) {
          throw new Error("Ivalid response from server");
        }

        // Save token and user_id
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", userId.toString());

        //  fetch the complete user details
        const userResponse = await fetch(
          `https://x8ki-letl-twmt.n7.xano.io/api:g9e8m6-t/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await userResponse.json();
        console.log("User details:", userData);

        // Save complete user object
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

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
