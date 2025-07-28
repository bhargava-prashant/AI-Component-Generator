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

  // Load sessions on mount / when user changes
  useEffect(() => {
    if (!user) {
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
      setGeneratedCode("");
      return;
    }

    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        console.log("🔍 Fetching sessions for user:", user._id);
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
        setSessions([]);
        setCurrentSession(null);
        setMessages([]);
        setGeneratedCode("");
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [user]);

  // Create a new session using backend API
  const createNewSession = async () => {
    try {
      console.log("🆕 Creating new session...");
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
      alert("Failed to create new session. Please try again.");
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
// import React, { useState, useEffect } from "react";
// import Sidebar from "../Sidebar/Sidebar";
// import ChatPanel from "../Chat/ChatPanel";
// import PreviewArea from "../Preview/PreviewArea";
// import api from "../../utils/api";
// import CanvasPreview from "../editor/CanvasPreview";
// import { useEditorStore } from "../../store/editorStore";

// function MainLayout({ user, setUser, setIsAuthenticated }) {
//   const [sessions, setSessions] = useState([]);
//   const [currentSession, setCurrentSession] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [generatedCode, setGeneratedCode] = useState("");
//   const [viewMode, setViewMode] = useState("preview");
//   const [loadingSessions, setLoadingSessions] = useState(false);

//   const setUiTree = useEditorStore((s) => s.setUiTree);

//   // Load sessions on mount / when user changes
//   useEffect(() => {
//     if (!user) {
//       setSessions([]);
//       setCurrentSession(null);
//       setMessages([]);
//       setGeneratedCode("");
//       return;
//     }

//     const fetchSessions = async () => {
//       setLoadingSessions(true);
//       try {
//         console.log("🔍 Fetching sessions for user:", user._id);
//         const res = await api.get("/session/sessions");
//         console.log("📦 Sessions response:", res.data);

//         const backendSessions = res.data.sessions || [];

//         setSessions(backendSessions);

//         const firstPersistentSession = backendSessions.find(s => !s.isTemporary);
//         if (firstPersistentSession) {
//           setCurrentSession(firstPersistentSession);
//           setMessages(firstPersistentSession.messages || []);
//           setGeneratedCode(firstPersistentSession.code || "");
//         } else if (backendSessions.length > 0) {
//           const first = backendSessions[0];
//           setCurrentSession(first);
//           setMessages(first.messages || []);
//           setGeneratedCode(first.code || "");
//         } else {
//           setCurrentSession(null);
//           setMessages([]);
//           setGeneratedCode("");
//         }
//       } catch (err) {
//         console.error("Error fetching sessions:", err);
//         setSessions([]);
//         setCurrentSession(null);
//         setMessages([]);
//         setGeneratedCode("");
//       } finally {
//         setLoadingSessions(false);
//       }
//     };

//     fetchSessions();
//   }, [user]);

//   useEffect(() => {
//     setUiTree({
//       'btn-1': {
//         text: 'Click Me',
//         style: {
//           padding: '12px',
//           fontSize: '16px',
//           color: '#fff',
//           backgroundColor: '#007bff',
//           borderRadius: '6px',
//         },
//       },
//       'txt-1': {
//         text: 'Hello, this is editable text!',
//         style: {
//           padding: '8px',
//           fontSize: '18px',
//           color: '#333',
//         },
//       },
//     });
//   }, []);

//   const createNewSession = async () => {
//     try {
//       console.log("🆕 Creating new session...");
//       const res = await api.post("/session/sessions/new");
//       const newSession = res.data.session;

//       console.log("✅ New session created:", newSession);

//       setSessions((prev) => [newSession, ...prev]);
//       setCurrentSession(newSession);
//       setMessages([]);
//       setGeneratedCode("");

//     } catch (err) {
//       console.error("Failed to create new session:", err);
//       alert("Failed to create new session. Please try again.");
//     }
//   };

//   useEffect(() => {
//     if (currentSession && !currentSession.isTemporary) {
//       setSessions(prev =>
//         prev.map(s => s._id === currentSession._id ? currentSession : s)
//       );
//     }
//   }, [currentSession]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         width: "100vw",
//         minWidth: 0,
//         overflow: "hidden",
//       }}
//     >
//       <Sidebar
//         user={user}
//         sessions={sessions}
//         setSessions={setSessions}
//         currentSession={currentSession}
//         setCurrentSession={setCurrentSession}
//         setIsAuthenticated={setIsAuthenticated}
//         setUser={setUser}
//         setMessages={setMessages}
//         setGeneratedCode={setGeneratedCode}
//         createNewSession={createNewSession}
//         loadingSessions={loadingSessions}
//       />
//       <div style={{ display: "flex", flex: 1, minWidth: 0 }}>
//         <ChatPanel
//           messages={messages}
//           setMessages={setMessages}
//           currentSession={currentSession}
//           setGeneratedCode={setGeneratedCode}
//         />
//         <PreviewArea
//           generatedCode={generatedCode}
//           viewMode={viewMode}
//           setViewMode={setViewMode}
//         />
//         <div style={{ flex: 1, padding: '1rem', position: 'relative' }}>
//           <CanvasPreview />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MainLayout;
