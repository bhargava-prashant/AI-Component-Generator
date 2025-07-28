// src/hooks/useSessionUpdate.js
import { useCallback } from 'react';
import api from '../utils/api';

export const useSessionUpdate = (currentSession, setCurrentSession, setSessions) => {
  // Update session with new data
  const updateSession = useCallback(async (updates) => {
    if (!currentSession) {
      console.warn('No current session to update');
      return null;
    }

    try {
      const response = await api.put(`/session/sessions/${currentSession._id}`, {
        ...currentSession,
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      const updatedSession = response.data.session;
      
      // Update current session
      setCurrentSession(updatedSession);
      
      // Update in sessions array
      setSessions(prev => prev.map(s => 
        s._id === updatedSession._id ? updatedSession : s
      ));
      
      return updatedSession;
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  }, [currentSession, setCurrentSession, setSessions]);

  // Add a message to current session
  const addMessage = useCallback(async (role, content) => {
    if (!currentSession) {
      throw new Error('No current session');
    }

    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...(currentSession.messages || []), message];
    
    return await updateSession({ messages: updatedMessages });
  }, [currentSession, updateSession]);

  // Update generated code
  const updateCode = useCallback(async (code) => {
    return await updateSession({ code });
  }, [updateSession]);

  // Update UI data
  const updateUI = useCallback(async (ui) => {
    return await updateSession({ ui });
  }, [updateSession]);

  // Update session name
  const updateName = useCallback(async (name) => {
    return await updateSession({ name });
  }, [updateSession]);

  return {
    updateSession,
    addMessage,
    updateCode,
    updateUI,
    updateName
  };
};