
import React, { useState } from "react";
import MainLayout from "./components/layouts/MainLayout";
import AuthModal from "./components/Auth/AuthModal";
import useDarkMode from "./hooks/useDarkMode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        boxSizing: "border-box",
        background: darkMode ? "#111827" : "#f9fafb",
      }}
    >
      {!isAuthenticated ? (
        <AuthModal
          darkMode={darkMode}
          authMode={authMode}
          setAuthMode={setAuthMode}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
      ) : (
        <MainLayout
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          setUser={setUser}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      {/* Global CSS to prevent any overflow */}
      <style>{`
        html, body, #root {
          height: 100%;
          width: 100vw;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default App;
