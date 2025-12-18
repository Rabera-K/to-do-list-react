import { createContext, useState, useContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext();

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  const contextValue = {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    isAuthenticated: !!auth.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
