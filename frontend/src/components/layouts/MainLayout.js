import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ChatPanel from "../Chat/ChatPanel";
import PreviewArea from "../Preview/PreviewArea";
import api from "../../utils/api";

function MainLayout({ user, setUser, setIsAuthenticated }) {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [viewMode, setViewMode] = useState("preview");
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [error, setError] = useState(null);

  // Load sessions on mount / when user changes
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setGeneratedCode("");
      setError(null);
      return;
    }

    const fetchSessions = async () => {
      setLoadingSessions(true);
      setError(null);
      
      try {
        console.log("🔍 Fetching sessions for user:", user._id);
        
        // Add a small delay to ensure session is properly established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const res = await api.get("/session/sessions");
        console.log("📦 Sessions response:", res.data);
        
        const backendSessions = res.data.sessions || [];
        
        setSessions(backendSessions);
        
        // Auto-select the first session if available and it's not temporary
        const firstPersistentSession = backendSessions.find(s => !s.isTemporary);
        if (firstPersistentSession) {
          setCurrentSession(firstPersistentSession);
          setMessages(firstPersistentSession.messages || []);
          setGeneratedCode(firstPersistentSession.code || "");
        } else if (backendSessions.length > 0) {
          // If only temporary sessions, select the first one
          const first = backendSessions[0];
          setCurrentSession(first);
          setMessages(first.messages || []);
          setGeneratedCode(first.code || "");
        } else {
          setCurrentSession(null);
          setMessages([]);
          setGeneratedCode("");
        }
        
      } catch (err) {
        console.error("Error fetching sessions:", err);
        
        // Handle authentication errors
        if (err.response?.status === 401) {
          console.log("🚪 Authentication failed, logging out user");
          setError("Session expired. Please login again.");
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setError("Failed to load sessions. Please refresh the page.");
        }
        
        setSessions([]);
        setCurrentSession(null);
        setMessages([]);
        setGeneratedCode("");
        
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [user, setIsAuthenticated, setUser]);

  // Create a new session using backend API
  const createNewSession = async () => {
    try {
      console.log("🆕 Creating new session...");
      setError(null);
      
      const res = await api.post("/session/sessions/new");
      const newSession = res.data.session;

      console.log("✅ New session created:", newSession);
      
      // Add to sessions list and select it
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      setGeneratedCode("");
      
    } catch (err) {
      console.error("Failed to create new session:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setError("Failed to create new session. Please try again.");
      }
    }
  };

  // Update session in sessions list when it changes
  useEffect(() => {
    if (currentSession && !currentSession.isTemporary) {
      setSessions(prev => 
        prev.map(s => s._id === currentSession._id ? currentSession : s)
      );
    }
  }, [currentSession]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Error banner */}
      {error && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
      
      <Sidebar
        user={user}
        sessions={sessions}
        setSessions={setSessions}
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
        setMessages={setMessages}
        setGeneratedCode={setGeneratedCode}
        createNewSession={createNewSession}
        loadingSessions={loadingSessions}
      />
      <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
        <ChatPanel
          messages={messages}
          setMessages={setMessages}
          currentSession={currentSession}
          setGeneratedCode={setGeneratedCode}
        />
        <PreviewArea
          generatedCode={generatedCode}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}

export default MainLayout;