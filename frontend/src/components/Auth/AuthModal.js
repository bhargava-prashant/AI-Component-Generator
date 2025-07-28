import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import styles from "../../styles/styleObjects";
import api from "../../utils/api"; // Use real API here

export default function AuthModal({
  darkMode,
  authMode,
  setAuthMode,
  setIsAuthenticated,
  setUser,
}) {
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    if (!authData.email || !authData.password) return;

    setLoading(true);

    try {
      let response;

      if (authMode === "login") {
        response = await api.post("/auth/login", {
          email: authData.email,
          password: authData.password,
        });
      } else {
        response = await api.post("/auth/signup", {
          name: authData.email.split("@")[0], // Basic name fallback
          email: authData.email,
          password: authData.password,
        });
      }

      // On successful login/signup:
      setUser(response.data.user);
      setIsAuthenticated(true);

      // Clear input fields after success
      setAuthData({ email: "", password: "" });
    } catch (err) {
      // Extract meaningful error message
      setError(
        err.response?.data?.message || "Authentication failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles(darkMode).authOverlay}>
      <div style={styles(darkMode).authBackground}></div>
      <div style={styles(darkMode).authModal}>
        <div style={styles(darkMode).authHeader}>
          <div style={styles(darkMode).authIcon}>
            <Sparkles size={32} color="#ffffff" />
          </div>
          <h1 style={styles(darkMode).authTitle}>AI UI Generator</h1>
          <p style={styles(darkMode).authSubtitle}>
            Create beautiful React components with AI
          </p>
        </div>

        <div style={styles(darkMode).authForm}>
          <input
            type="email"
            placeholder="Email"
            value={authData.email}
            onChange={(e) =>
              setAuthData((prev) => ({ ...prev, email: e.target.value }))
            }
            style={styles(darkMode).authInput}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={authData.password}
            onChange={(e) =>
              setAuthData((prev) => ({ ...prev, password: e.target.value }))
            }
            style={styles(darkMode).authInput}
            disabled={loading}
          />
          <button
            onClick={handleAuth}
            disabled={loading || !authData.email || !authData.password}
            style={{
              ...styles(darkMode).authButton,
              ...(loading || !authData.email || !authData.password
                ? styles(darkMode).authButtonDisabled
                : {}),
            }}
          >
            {loading
              ? "Signing in..."
              : authMode === "login"
              ? "Sign In"
              : "Sign Up"}
          </button>
          {error && (
            <p
              style={{
                color: "#ef4444",
                marginTop: 12,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div style={styles(darkMode).authToggle}>
          {authMode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login");
              setError("");
            }}
            style={styles(darkMode).authToggleLink}
          >
            {authMode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}
