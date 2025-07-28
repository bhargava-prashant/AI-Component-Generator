import React, { useRef, useEffect, useState } from "react";
import { Send, Upload, MessageSquare, Copy, Check, Eye, Code2 } from "lucide-react";
import styles from "../../styles/styleObjects";
import LoadingDots from "../Common/LoadingDots";
import api from "../../utils/api";
import ReactMarkdown from 'react-markdown';

function ChatPanel({
  messages,
  setMessages,
  currentSession,
  setGeneratedCode,
}) {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [activeCodeBlocks, setActiveCodeBlocks] = useState({});
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Enhanced function to extract multiple code blocks
  const extractCodeBlocksFromResponse = (content) => {
    const codeBlocks = [];
    
    // Regex to match code blocks with optional language specification
    const codeBlockRegex = /```(?:(\w+))?\s*([\s\S]*?)```/g;
    let match;
    let blockIndex = 0;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      if (code) {
        // Try to determine filename based on language or content
        let filename = `file${blockIndex + 1}`;
        let extension = '';
        
        switch (language.toLowerCase()) {
          case 'jsx':
          case 'react':
            extension = '.jsx';
            filename = code.includes('export default') ? 
              (code.match(/(?:function|const)\s+(\w+)/)?.[1] || 'Component') : 
              'Component';
            break;
          case 'javascript':
          case 'js':
            extension = '.js';
            filename = code.includes('export default') ? 
              (code.match(/(?:function|const)\s+(\w+)/)?.[1] || 'script') : 
              'script';
            break;
          case 'html':
            extension = '.html';
            filename = 'index';
            break;
          case 'css':
            extension = '.css';
            filename = 'styles';
            break;
          case 'json':
            extension = '.json';
            filename = 'data';
            break;
          case 'python':
          case 'py':
            extension = '.py';
            filename = 'script';
            break;
          default:
            extension = '.txt';
        }
        
        codeBlocks.push({
          id: `${Date.now()}-${blockIndex}`,
          filename: `${filename}${extension}`,
          language,
          code,
          originalMatch: match[0]
        });
        
        blockIndex++;
      }
    }
    
    // Fallback: look for component-like patterns if no code blocks found
    if (codeBlocks.length === 0) {
      if ((content.includes('function ') && content.includes('return')) || 
          (content.includes('const ') && content.includes('=>')) || 
          (content.includes('<div') && content.includes('</div>')) || 
          content.includes('export default')) {
        
        codeBlocks.push({
          id: `${Date.now()}-0`,
          filename: 'Component.jsx',
          language: 'jsx',
          code: content,
          originalMatch: content
        });
      }
    }
    
    return codeBlocks;
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString(),
      image: image ? URL.createObjectURL(image) : null,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setPrompt("");
    setImage(null);

    try {
      const response = await api.post("/generate", { prompt });
      
      const responseContent = response.data.code || response.data.response || response.data.content || response.data.message || "No response received";
      
      // Extract multiple code blocks
      const codeBlocks = extractCodeBlocksFromResponse(responseContent);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString(),
        codeBlocks: codeBlocks,
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);
      
      // Set the first code block as the generated code for backward compatibility
      if (codeBlocks.length > 0) {
        setGeneratedCode(codeBlocks[0].code);
        
        // Set the first code block as active by default
        setActiveCodeBlocks(prev => ({
          ...prev,
          [aiMessage.id]: 0
        }));
      }

      // Save session with updated messages if we have a current session
      if (currentSession) {
        try {
          const sessionUpdateData = {
            messages: updatedMessages,
            code: codeBlocks.length > 0 ? codeBlocks[0].code : (currentSession.code || ""),
            name: currentSession.name === "New Session" ? 
              (prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt) : 
              currentSession.name
          };

          await api.put(`/session/sessions/${currentSession._id}`, sessionUpdateData);
          console.log("✅ Session updated with new messages");
        } catch (sessionError) {
          console.error("Failed to save session:", sessionError);
        }
      }
      
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          content: "Failed to generate response. Please try again later.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const copyToClipboard = async (text, copyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(copyId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePreviewCode = (codeBlock) => {
    setGeneratedCode(codeBlock.code);
  };

  const setActiveCodeBlock = (messageId, blockIndex) => {
    setActiveCodeBlocks(prev => ({
      ...prev,
      [messageId]: blockIndex
    }));
  };

  const renderCodeBlocks = (message) => {
    if (!message.codeBlocks || message.codeBlocks.length === 0) return null;

    const activeBlockIndex = activeCodeBlocks[message.id] || 0;
    const activeBlock = message.codeBlocks[activeBlockIndex];

    return (
      <div style={styles().multiCodeContainer || {
        marginTop: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f9fafb'
      }}>
        {/* File tabs */}
        {message.codeBlocks.length > 1 && (
          <div style={styles().codeTabsContainer || {
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderBottom: '1px solid #e5e7eb',
            overflowX: 'auto'
          }}>
            {message.codeBlocks.map((block, index) => (
              <button
                key={block.id}
                onClick={() => setActiveCodeBlock(message.id, index)}
                style={{
                  ...(styles().codeTab || {
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
                    transition: 'all 0.2s ease'
                  }),
                  ...(index === activeBlockIndex ? (styles().codeTabActive || {
                    backgroundColor: '#ffffff',
                    borderBottom: '2px solid #3b82f6',
                    color: '#3b82f6'
                  }) : {
                    color: '#6b7280',
                    '&:hover': {
                      backgroundColor: '#e5e7eb'
                    }
                  })
                }}
              >
                <Code2 size={14} />
                {block.filename}
              </button>
            ))}
          </div>
        )}

        {/* Active code block */}
        <div>
          <div style={styles().codeHeader || {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderBottom: message.codeBlocks.length === 1 ? 'none' : '1px solid #e5e7eb'
          }}>
            <div style={styles().codeInfo || {
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {message.codeBlocks.length === 1 && (
                <>
                  <Code2 size={16} color="#6b7280" />
                  <span style={styles().codeLabel || {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {activeBlock.filename}
                  </span>
                </>
              )}
              <span style={styles().languageLabel || {
                fontSize: '12px',
                padding: '2px 6px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                borderRadius: '4px',
                textTransform: 'uppercase'
              }}>
                {activeBlock.language}
              </span>
            </div>
            
            <div style={styles().codeActions || {
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => handlePreviewCode(activeBlock)}
                style={styles().previewButton || {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#374151',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#9ca3af'
                  }
                }}
                title="Preview this code"
              >
                <Eye size={12} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => copyToClipboard(activeBlock.code, `${message.id}-${activeBlockIndex}`)}
                style={{
                  ...(styles().copyButton || {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }),
                  ...(copiedId === `${message.id}-${activeBlockIndex}` ? (styles().copyButtonActive || {
                    backgroundColor: '#dcfce7',
                    borderColor: '#16a34a',
                    color: '#16a34a'
                  }) : {})
                }}
                title="Copy code"
              >
                {copiedId === `${message.id}-${activeBlockIndex}` ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <pre style={styles().generatedCodeBlock || {
            margin: 0,
            padding: '16px',
            backgroundColor: '#1f2937',
            color: '#f9fafb',
            fontSize: '13px',
            lineHeight: '1.5',
            overflow: 'auto',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          }}>
            <code>{activeBlock.code}</code>
          </pre>
        </div>
      </div>
    );
  };

  const renderMessageContent = (message) => {
    // Handle messages with code blocks
    if (message.codeBlocks && message.codeBlocks.length > 0) {
      // Remove code blocks from content for text display
      let textContent = message.content;
      message.codeBlocks.forEach(block => {
        textContent = textContent.replace(block.originalMatch, '');
      });
      textContent = textContent.trim();
      
      return (
        <div>
          {textContent && (
            <div style={styles().messageText}>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 style={styles().messageHeading1} {...props} />,
                  h2: ({ node, ...props }) => <h2 style={styles().messageHeading2} {...props} />,
                  h3: ({ node, ...props }) => <h3 style={styles().messageHeading3} {...props} />,
                  p: ({ node, ...props }) => <p style={styles().messageParagraph} {...props} />,
                  ul: ({ node, ...props }) => <ul style={styles().messageList} {...props} />,
                  ol: ({ node, ...props }) => <ol style={styles().messageList} {...props} />,
                  li: ({ node, ...props }) => <li style={styles().messageListItem} {...props} />,
                  strong: ({ node, ...props }) => <strong style={styles().messageBold} {...props} />,
                  em: ({ node, ...props }) => <em style={styles().messageItalic} {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? <code style={styles().messageInlineCode} {...props} /> : null,
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}
          {renderCodeBlocks(message)}
        </div>
      );
    }

    // Handle legacy single code block (backward compatibility)
    if (message.code) {
      const textContent = message.content.replace(/```(?:jsx?|html|css|javascript|js|react)?\s*[\s\S]*?```/g, '').trim();
      
      return (
        <div>
          {textContent && (
            <div style={styles().messageText}>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 style={styles().messageHeading1} {...props} />,
                  h2: ({ node, ...props }) => <h2 style={styles().messageHeading2} {...props} />,
                  h3: ({ node, ...props }) => <h3 style={styles().messageHeading3} {...props} />,
                  p: ({ node, ...props }) => <p style={styles().messageParagraph} {...props} />,
                  ul: ({ node, ...props }) => <ul style={styles().messageList} {...props} />,
                  ol: ({ node, ...props }) => <ol style={styles().messageList} {...props} />,
                  li: ({ node, ...props }) => <li style={styles().messageListItem} {...props} />,
                  strong: ({ node, ...props }) => <strong style={styles().messageBold} {...props} />,
                  em: ({ node, ...props }) => <em style={styles().messageItalic} {...props} />,
                  code: ({ node, inline, ...props }) => 
                    inline ? <code style={styles().messageInlineCode} {...props} /> : null,
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}
          <div style={styles().codeContainer}>
            <div style={styles().codeHeader}>
              <span style={styles().codeLabel}>Generated Code</span>
              <button
                onClick={() => copyToClipboard(message.code, message.id)}
                style={{
                  ...styles().copyButton,
                  ...(copiedId === message.id ? styles().copyButtonActive : {})
                }}
                title="Copy code"
              >
                {copiedId === message.id ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre style={styles().generatedCodeBlock}>
              <code>{message.code}</code>
            </pre>
          </div>
        </div>
      );
    }
    
    // Regular message without code
    return (
      <div style={styles().messageText}>
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 style={styles().messageHeading1} {...props} />,
            h2: ({ node, ...props }) => <h2 style={styles().messageHeading2} {...props} />,
            h3: ({ node, ...props }) => <h3 style={styles().messageHeading3} {...props} />,
            p: ({ node, ...props }) => <p style={styles().messageParagraph} {...props} />,
            ul: ({ node, ...props }) => <ul style={styles().messageList} {...props} />,
            ol: ({ node, ...props }) => <ol style={styles().messageList} {...props} />,
            li: ({ node, ...props }) => <li style={styles().messageListItem} {...props} />,
            strong: ({ node, ...props }) => <strong style={styles().messageBold} {...props} />,
            em: ({ node, ...props }) => <em style={styles().messageItalic} {...props} />,
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre style={styles().messageCodeBlock}>
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
              ) : (
                <code style={styles().messageInlineCode} {...props}>
                  {children}
                </code>
              );
            },
            blockquote: ({ node, ...props }) => (
              <blockquote 
                style={{
                  borderLeft: '4px solid #e5e7eb',
                  paddingLeft: '12px',
                  margin: '8px 0',
                  fontStyle: 'italic',
                  color: '#6b7280'
                }} 
                {...props} 
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div style={styles().chatPanel}>
      <div style={styles().chatHeader}>
        <h3 style={styles().chatTitle}>
          <MessageSquare size={20} />
          <span>Chat</span>
        </h3>
      </div>
      <div style={styles().messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles().messageWrapper,
              ...(message.type === "user"
                ? styles().messageWrapperUser
                : styles().messageWrapperAi),
            }}
          >
            <div
              style={{
                ...styles().message,
                ...(message.type === "user"
                  ? styles().messageUser
                  : styles().messageAi),
              }}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Uploaded"
                  style={styles().messageImage}
                />
              )}
              {renderMessageContent(message)}
              <div style={styles().messageTime}>{message.timestamp}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles().messageWrapperAi}>
            <div style={{ ...styles().message, ...styles().messageAi }}>
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles().inputArea}>
        {image && (
          <div style={styles().imagePreview}>
            <div style={styles().imagePreviewText}>Image attached: {image.name}</div>
            <div
              onClick={() => setImage(null)}
              style={styles().removeImageButton}
            >
              Remove
            </div>
          </div>
        )}
        <div style={styles().inputContainer}>
          <div style={styles().textareaContainer}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything or describe your UI component..."
              style={styles().textarea}
              rows={3}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={styles().uploadButton}
            >
              <Upload size={16} />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            style={{
              ...styles().sendButton,
              ...(loading || !prompt.trim()
                ? styles().sendButtonDisabled
                : {}),
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;