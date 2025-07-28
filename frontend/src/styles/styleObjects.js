// src/styles/styleObjects.js

export default function styles() {
  return {
    // Global styles
    app: {
      height: '100vh',
      display: 'flex',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f9fafb',
      color: '#111827',
      minWidth: 0,
      overflowX: 'hidden',
    },

    // ---------- Auth Modal ----------
    authOverlay: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#f9fafb',
      position: 'relative',
    },
    authBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(219, 39, 119, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%)',
    },
    authModal: {
      position: 'relative',
      width: '100%',
      maxWidth: 400,
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    authHeader: {
      textAlign: 'center',
      marginBottom: 32,
    },
    authIcon: {
      width: 64,
      height: 64,
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    authTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: 8,
    },
    authSubtitle: {
      color: '#6b7280',
      fontSize: 14,
    },
    authForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    authInput: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 8,
      border: '1px solid #d1d5db',
      backgroundColor: '#ffffff',
      color: '#111827',
      fontSize: 16,
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    authButton: {
      width: '100%',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      color: '#ffffff',
      fontWeight: 600,
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      fontSize: 16,
      transition: 'all 0.2s ease',
      transform: 'scale(1)',
    },
    authButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    authToggle: {
      marginTop: 16,
      textAlign: 'center',
      fontSize: 14,
      color: '#6b7280',
    },
    authToggleLink: {
      color: '#9333ea',
      cursor: 'pointer',
      fontWeight: 500,
      textDecoration: 'none',
    },

    // ---------- Sidebar ----------
    sidebar: {
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      minWidth: 0,
    },
    sidebarHeader: {
      padding: 16,
      borderBottom: '1px solid #e5e7eb',
    },
    sidebarTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    sidebarUser: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    sidebarIcon: {
      width: 32,
      height: 32,
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sidebarUserInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarUserName: {
      fontWeight: 600,
      fontSize: 14,
    },
    sidebarUserEmail: {
      fontSize: 12,
      color: '#6b7280',
    },
    sidebarActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    iconButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#111827',
      transition: 'background-color 0.2s ease',
    },
    newSessionButton: {
      width: '100%',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      color: '#ffffff',
      borderRadius: 8,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },

    // Sessions List
    sessionsList: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      minHeight: 0,
    },
    sessionsTitle: {
      fontSize: 12,
      fontWeight: 500,
      color: '#6b7280',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sessionItem: {
      padding: 12,
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: 8,
      border: '1px solid transparent',
    },
    sessionItemActive: {
      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(219, 39, 119, 0.1) 100%)',
      border: '1px solid rgba(147, 51, 234, 0.2)',
    },
    sessionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    sessionName: {
      fontWeight: 500,
      fontSize: 14,
    },
    sessionDate: {
      fontSize: 12,
      color: '#6b7280',
    },

    // ---------- Main Content ----------
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
    },

    // ---------- Chat Panel ----------
    chatPanel: {
      width: 384,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e5e7eb',
      minWidth: 0,
      backgroundColor: '#ffffff',
    },
    chatHeader: {
      padding: 16,
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
    },
    chatTitle: {
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: '#111827',
    },

    // Messages
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 0,
      backgroundColor: '#f9fafb',
    },
    messageWrapper: {
      display: 'flex',
    },
    messageWrapperUser: {
      justifyContent: 'flex-end',
    },
    messageWrapperAi: {
      justifyContent: 'flex-start',
    },
    message: {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    messageUser: {
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      color: '#ffffff',
    },
    messageAi: {
      backgroundColor: '#ffffff',
      color: '#111827',
      border: '1px solid #e5e7eb',
    },
    messageImage: {
      width: '100%',
      height: 128,
      objectFit: 'cover',
      borderRadius: 8,
      marginBottom: 8,
    },

    // Message Text - Clean base style
    messageText: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    messageTime: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 8,
    },

    // Markdown styling within messages
    markdownContent: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#111827',
    },

    // Headings in messages
    messageHeading1: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 8,
      marginTop: 12,
      color: '#1f2937',
      lineHeight: 1.4,
    },

    messageHeading2: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 6,
      marginTop: 10,
      color: '#374151',
      lineHeight: 1.4,
    },

    messageHeading3: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 4,
      marginTop: 8,
      color: '#4b5563',
      lineHeight: 1.4,
    },

    // Paragraphs in messages
    messageParagraph: {
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: 8,
      color: '#111827',
    },

    // Lists in messages
    messageList: {
      paddingLeft: 16,
      marginBottom: 8,
      marginTop: 4,
    },

    messageListItem: {
      marginBottom: 4,
      fontSize: 14,
      lineHeight: 1.5,
      color: '#111827',
    },

    // Text formatting
    messageBold: {
      fontWeight: 600,
      color: '#1f2937',
    },

    messageItalic: {
      fontStyle: 'italic',
      color: '#374151',
    },

    // Inline code in messages
    messageInlineCode: {
      backgroundColor: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: 4,
      padding: '2px 6px',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      fontSize: 12,
      color: '#dc2626',
    },

    // Code Container for code blocks
    codeContainer: {
      marginTop: 12,
      marginBottom: 8,
      border: '1px solid #d1d5db',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    },

    codeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e5e7eb',
    },

    codeLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: '#374151',
    },

    copyButton: {
      background: 'none',
      border: '1px solid #d1d5db',
      borderRadius: 4,
      cursor: 'pointer',
      padding: '4px 8px',
      color: '#6b7280',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      transition: 'all 0.2s ease',
    },

    copyButtonActive: {
      backgroundColor: '#dcfce7',
      borderColor: '#16a34a',
      color: '#166534',
    },

    // Code blocks in messages
    messageCodeBlock: {
      margin: 0,
      padding: 16,
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      fontSize: 13,
      lineHeight: 1.5,
      overflow: 'auto',
      maxHeight: 300,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      whiteSpace: 'pre-wrap',
    },

    // Generated code block (separate from inline code blocks)
    generatedCodeBlock: {
      margin: 0,
      padding: 16,
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      fontSize: 13,
      lineHeight: 1.6,
      overflow: 'auto',
      maxHeight: 400,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      whiteSpace: 'pre-wrap',
    },

    // Alternative code block style (for backwards compatibility)
    codeBlock: {
      margin: 0,
      padding: 16,
      backgroundColor: '#1e293b',
      color: '#f1f5f9',
      fontSize: 13,
      lineHeight: 1.6,
      overflow: 'auto',
      maxHeight: 400,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      whiteSpace: 'pre-wrap',
    },

    // Loading dots
    loadingDots: {
      display: 'flex',
      gap: 4,
      padding: '8px 0',
    },
    loadingDot: {
      width: 8,
      height: 8,
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      animation: 'bounce 1.4s ease-in-out infinite both',
    },

    // Input Area
    inputArea: {
      padding: 16,
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#ffffff',
    },
    imagePreview: {
      marginBottom: 8,
      padding: 8,
      backgroundColor: '#f3f4f6',
      borderRadius: 6,
      border: '1px solid #e5e7eb',
    },
    imagePreviewText: {
      fontSize: 14,
      color: '#6b7280',
    },
    removeImageButton: {
      fontSize: 12,
      color: '#ef4444',
      cursor: 'pointer',
      marginTop: 4,
      fontWeight: 500,
    },
    inputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    textareaContainer: {
      flex: 1,
      position: 'relative',
    },
    textarea: {
      width: '100%',
      padding: '20px 0px 20px 2px', // leave space for send button
      borderRadius: 8,
      border: '1px solid #d1d5db',
      backgroundColor: '#ffffff',
      color: '#111827',
      resize: 'none',
      outline: 'none',
      fontSize: 14,
      lineHeight: 1.4,
      transition: 'border-color 0.2s ease',
    },
    uploadButton: {
      position: 'absolute',
      right: 10,
      top: 15,
      padding: 8,
      borderRadius: 6,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      transition: 'color 0.2s ease',
    },
    sendButton: {
      position: 'absolute',
      right: 4,
      bottom: 10,
      padding: '8px 12px',
      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
      color: '#ffffff',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.2s ease',
      fontWeight: 500,
    },
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    // ---------- Preview Area ----------
    previewArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      backgroundColor: '#ffffff',
    },
    previewHeader: {
      padding: 16,
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
    },
    previewTitle: {
      fontWeight: 600,
      color: '#111827',
    },
    viewModeToggle: {
      display: 'flex',
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
      padding: 4,
      border: '1px solid #e5e7eb',
    },
    viewModeButton: {
      padding: '6px 12px',
      borderRadius: 6,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'transparent',
      color: '#6b7280',
      fontWeight: 500,
    },
    viewModeButtonActive: {
      backgroundColor: '#9333ea',
      color: '#ffffff',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },

    previewContent: {
      flex: 1,
      padding: 16,
      minHeight: 0,
      backgroundColor: '#f9fafb',
    },
    previewBox: {
      height: '100%',
      borderRadius: 8,
      border: '2px dashed #d1d5db',
      backgroundColor: '#ffffff',
      padding: 16,
      overflow: 'auto',
    },
    previewError: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      textAlign: 'center',
      color: '#6b7280',
      gap: 8,
    },
    codeBox: {
      height: '100%',
      borderRadius: 8,
      backgroundColor: '#1e293b',
      padding: 0,
      overflow: 'hidden',
      border: '1px solid #334155',
    },
    codeText: {
      fontSize: 13,
      color: '#f1f5f9',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      whiteSpace: 'pre-wrap',
      padding: 16,
      margin: 0,
      height: '100%',
      overflow: 'auto',
      lineHeight: 1.6,
    },
    emptyState: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      border: '2px dashed #d1d5db',
      backgroundColor: '#ffffff',
    },
    emptyStateContent: {
      textAlign: 'center',
    },
    emptyStateIcon: {
      width: 48,
      height: 48,
      margin: '0 auto 16px',
      color: '#9ca3af',
      display: 'block',
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 8,
      color: '#6b7280',
    },
    emptyStateText: {
      color: '#9ca3af',
      fontSize: 14,
    },
  };
}