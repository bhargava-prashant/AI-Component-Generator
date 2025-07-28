
import React, { useState } from "react";
import { Sparkles, Plus, MessageSquare, LogOut, Trash2, AlertCircle } from "lucide-react";
import styles from "../../styles/styleObjects";
import api from "../../utils/api";

function Sidebar({
  user,
  sessions,
  setSessions,
  currentSession,
  setCurrentSession,
  setIsAuthenticated,
  setUser,
  setMessages,
  setGeneratedCode,
  createNewSession,
  loadingSessions,
}) {
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState(null);

  // Select a session and load its data
  const selectSession = async (session) => {
    try {
      setError(null);
      setCurrentSession(session);
      
      // If it's a temporary session, just load local data
      if (session.isTemporary) {
        setMessages(session.messages || []);
        setGeneratedCode(session.code || "");
        return;
      }

      // For persistent sessions, fetch latest data from server
      const response = await api.get(`/session/sessions/${session._id}`);
      const latestSession = response.data.session;
      
      setCurrentSession(latestSession);
      setMessages(latestSession.messages || []);
      setGeneratedCode(latestSession.code || "");
      
      // Update the session in the local sessions list
      setSessions(prev => 
        prev.map(s => s._id === session._id ? latestSession : s)
      );
    } catch (error) {
      console.error("Failed to load session:", error);
      setError("Failed to load session. Please try again.");
      
      // Fallback to local data
      setMessages(session.messages || []);
      setGeneratedCode(session.code || "");
    }
  };

  // Delete a session
  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    try {
      setDeleteLoading(sessionId);
      setError(null);
      
      await api.delete(`/session/sessions/${sessionId}`);
      
      // Remove from local state
      setSessions(prev => prev.filter(s => s._id !== sessionId));

      // If we're deleting the current session, clear it
      if (currentSession?._id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
        setGeneratedCode("");
      }
      
      console.log("✅ Session deleted successfully");
    } catch (error) {
      console.error("Failed to delete session:", error);
      setError("Failed to delete session. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Logout and clear all session-related states
  const handleLogout = async () => {
    try {
      setError(null);
      await api.post("/auth/logout");
      
      // Clear all states
      setIsAuthenticated(false);
      setUser(null);
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setGeneratedCode("");
      
      console.log("✅ Logout successful");
    } catch (err) {
      console.error("Logout failed:", err);
      
      // Even if logout fails, clear local state
      setIsAuthenticated(false);
      setUser(null);
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setGeneratedCode("");
    }
  };

  // Clear error message
  const clearError = () => setError(null);

  return (
    <div style={styles().sidebar}>
      <div style={styles().sidebarHeader}>
        <div style={styles().sidebarTop}>
          <div style={styles().sidebarUser}>
            <div style={styles().sidebarIcon}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div style={styles().sidebarUserInfo}>
              <div style={styles().sidebarUserName}>AI UI Generator</div>
              <div style={styles().sidebarUserEmail}>Welcome, {user?.name}</div>
            </div>
          </div>
          <div style={styles().sidebarActions}>
            <button
              onClick={handleLogout}
              style={styles().iconButton}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
        
        <button 
          onClick={createNewSession} 
          style={styles().newSessionButton}
          disabled={loadingSessions}
        >
          <Plus size={16} />
          <span>New Session</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          margin: '12px 16px',
          padding: '8px 12px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span style={{ flex: 1 }}>{error}</span>
          <button 
            onClick={clearError}
            style={{
              background: 'none',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={styles().sessionsList}>
        <h3 style={styles().sessionsTitle}>Sessions</h3>
        <div>
          {loadingSessions ? (
            <div style={{ padding: 16, color: "#6b7280", textAlign: 'center' }}>
              <div style={{ marginBottom: 8 }}>Loading sessions...</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Please wait</div>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: 16, color: "#6b7280", textAlign: 'center' }}>
              <div style={{ marginBottom: 8 }}>No sessions yet</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Create a new session to get started</div>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => selectSession(session)}
                style={{
                  ...styles().sessionItem,
                  ...(currentSession?._id === session._id ? styles().sessionItemActive : {}),
                  opacity: deleteLoading === session._id ? 0.5 : 1,
                  cursor: deleteLoading === session._id ? 'not-allowed' : 'pointer'
                }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && deleteLoading !== session._id) {
                    selectSession(session);
                  }
                }}
              >
                <div style={styles().sessionHeader}>
                  <MessageSquare size={16} />
                  <span style={styles().sessionName}>
                    {session.name}
                    {session.isTemporary && (
                      <span style={{ 
                        fontSize: 10, 
                        opacity: 0.6, 
                        marginLeft: 4,
                        fontStyle: 'italic'
                      }}>
                        (temp)
                      </span>
                    )}
                  </span>
                  {!session.isTemporary && (
                    <button
                      onClick={(e) => deleteSession(session._id, e)}
                      style={{
                        ...styles().deleteButton,
                        opacity: deleteLoading === session._id ? 0.5 : 1
                      }}
                      aria-label="Delete session"
                      title="Delete session"
                      disabled={deleteLoading === session._id}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div style={styles().sessionDate}>
                  {session.updatedAt 
                    ? new Date(session.updatedAt).toLocaleString()
                    : new Date(session.createdAt).toLocaleString()
                  }
                  {session.messages?.length > 0 && (
                    <span style={{ 
                      fontSize: 11, 
                      opacity: 0.7, 
                      marginLeft: 8 
                    }}>
                      ({session.messages.length} messages)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
