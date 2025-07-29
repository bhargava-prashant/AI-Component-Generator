// src/styles/styleObjects.js

export default function styles() {
  return {
    // Global styles
    app: {
      height: '100vh',
      display: 'flex',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      color: '#212529',
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
      backgroundColor: '#f8f9fa',
      position: 'relative',
    },
    authBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(108, 117, 125, 0.1) 0%, rgba(73, 80, 87, 0.1) 100%)',
    },
    authModal: {
      position: 'relative',
      width: '100%',
      maxWidth: 400,
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #e9ecef',
    },
    authHeader: {
      textAlign: 'center',
      marginBottom: 32,
    },
    authIcon: {
      width: 64,
      height: 64,
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
    },
    authTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 8,
    },
    authSubtitle: {
      color: '#6c757d',
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
      border: '1px solid #ced4da',
      backgroundColor: '#ffffff',
      color: '#212529',
      fontSize: 16,
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    authButton: {
      width: '100%',
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
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
      color: '#6c757d',
    },
    authToggleLink: {
      color: '#343a40',
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
      borderRight: '1px solid #e9ecef',
      minWidth: 0,
    },
    sidebarHeader: {
      padding: 16,
      borderBottom: '1px solid #e9ecef',
      backgroundColor: '#f8f9fa',
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
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
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
      color: '#212529',
    },
    sidebarUserEmail: {
      fontSize: 12,
      color: '#6c757d',
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
      color: '#495057',
      transition: 'background-color 0.2s ease',
    },
    newSessionButton: {
      width: '100%',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
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
      color: '#6c757d',
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
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
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
      color: '#212529',
    },
    sessionDate: {
      fontSize: 12,
      color: '#6c757d',
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
      borderRight: '1px solid #e9ecef',
      minWidth: 0,
      backgroundColor: '#ffffff',
    },
    chatHeader: {
      padding: 16,
      borderBottom: '1px solid #e9ecef',
      backgroundColor: '#f8f9fa',
    },
    chatTitle: {
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: '#212529',
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
      backgroundColor: '#f8f9fa',
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
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
      color: '#ffffff',
    },
    messageAi: {
      backgroundColor: '#ffffff',
      color: '#212529',
      border: '1px solid #e9ecef',
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
      color: '#212529',
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
      color: '#212529',
    },

    // Headings in messages
    messageHeading1: {
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 8,
      marginTop: 12,
      color: '#212529',
      lineHeight: 1.4,
    },

    messageHeading2: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 6,
      marginTop: 10,
      color: '#343a40',
      lineHeight: 1.4,
    },

    messageHeading3: {
      fontSize: 15,
      fontWeight: 600,
      marginBottom: 4,
      marginTop: 8,
      color: '#495057',
      lineHeight: 1.4,
    },

    // Paragraphs in messages
    messageParagraph: {
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: 8,
      color: '#212529',
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
      color: '#212529',
    },

    // Text formatting
    messageBold: {
      fontWeight: 600,
      color: '#212529',
    },

    messageItalic: {
      fontStyle: 'italic',
      color: '#343a40',
    },

    // Inline code in messages
    messageInlineCode: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: 4,
      padding: '2px 6px',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      fontSize: 12,
      color: '#495057',
    },

    // Code Container for code blocks
    codeContainer: {
      marginTop: 12,
      marginBottom: 8,
      border: '1px solid #dee2e6',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#ffffff',
    },

    codeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
    },

    codeLabel: {
      fontSize: 12,
      fontWeight: 600,
      color: '#343a40',
    },

    copyButton: {
      background: 'none',
      border: '1px solid #ced4da',
      borderRadius: 4,
      cursor: 'pointer',
      padding: '4px 8px',
      color: '#6c757d',
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      transition: 'all 0.2s ease',
    },

    copyButtonActive: {
      backgroundColor: '#d1ecf1',
      borderColor: '#b8daff',
      color: '#004085',
    },

    // Download button styles
    downloadButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      border: '1px solid #343a40',
      backgroundColor: '#f8f9fa',
      color: '#343a40',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },

    // Code blocks in messages
    messageCodeBlock: {
      margin: 0,
      padding: 16,
      backgroundColor: '#212529',
      color: '#f8f9fa',
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
      backgroundColor: '#212529',
      color: '#f8f9fa',
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
      backgroundColor: '#212529',
      color: '#f8f9fa',
      fontSize: 13,
      lineHeight: 1.6,
      overflow: 'auto',
      maxHeight: 400,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
      whiteSpace: 'pre-wrap',
    },

    // Multi-code container styles
    multiCodeContainer: {
      marginTop: '12px',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    },

    codeTabsContainer: {
      display: 'flex',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      overflowX: 'auto'
    },

    codeTab: {
      padding: '8px 16px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
      color: '#6c757d',
    },

    codeTabActive: {
      backgroundColor: '#ffffff',
      borderBottom: '2px solid #343a40',
      color: '#343a40'
    },

    codeInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    languageLabel: {
      fontSize: '12px',
      padding: '2px 6px',
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      borderRadius: '4px',
      textTransform: 'uppercase'
    },

    codeActions: {
      display: 'flex',
      gap: '8px'
    },

    previewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '6px 12px',
      border: '1px solid #ced4da',
      backgroundColor: '#ffffff',
      color: '#343a40',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
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
      backgroundColor: '#6c757d',
      borderRadius: '50%',
      animation: 'bounce 1.4s ease-in-out infinite both',
    },

    // Input Area
    inputArea: {
      padding: 16,
      borderTop: '1px solid #e9ecef',
      backgroundColor: '#ffffff',
    },
    imagePreview: {
      marginBottom: 8,
      padding: 8,
      backgroundColor: '#f8f9fa',
      borderRadius: 6,
      border: '1px solid #e9ecef',
    },
    imagePreviewText: {
      fontSize: 14,
      color: '#6c757d',
    },
    removeImageButton: {
      fontSize: 12,
      color: '#dc3545',
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
      padding: '20px 0px 20px 2px',
      borderRadius: 8,
      border: '1px solid #ced4da',
      backgroundColor: '#ffffff',
      color: '#212529',
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
      color: '#6c757d',
      transition: 'color 0.2s ease',
    },
    sendButton: {
      position: 'absolute',
      right: 4,
      bottom: 10,
      padding: '8px 12px',
      background: 'linear-gradient(135deg, #343a40 0%, #212529 100%)',
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
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f8f9fa',
    },
    previewTitle: {
      fontWeight: 600,
      color: '#212529',
    },
    viewModeToggle: {
      display: 'flex',
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 4,
      border: '1px solid #e9ecef',
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
      color: '#6c757d',
      fontWeight: 500,
    },
    viewModeButtonActive: {
      backgroundColor: '#343a40',
      color: '#ffffff',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    },

    previewContent: {
      flex: 1,
      padding: 16,
      minHeight: 0,
      backgroundColor: '#f8f9fa',
    },
    previewBox: {
      height: '100%',
      borderRadius: 8,
      border: '2px dashed #ced4da',
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
      color: '#6c757d',
      gap: 8,
    },
    codeBox: {
      height: '100%',
      borderRadius: 8,
      backgroundColor: '#212529',
      padding: 0,
      overflow: 'hidden',
      border: '1px solid #495057',
    },
    codeText: {
      fontSize: 13,
      color: '#f8f9fa',
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
      border: '2px dashed #ced4da',
      backgroundColor: '#ffffff',
    },
    emptyStateContent: {
      textAlign: 'center',
    },
    emptyStateIcon: {
      width: 48,
      height: 48,
      margin: '0 auto 16px',
      color: '#adb5bd',
      display: 'block',
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 500,
      marginBottom: 8,
      color: '#6c757d',
    },
    emptyStateText: {
      color: '#adb5bd',
      fontSize: 14,
    },
  };
}