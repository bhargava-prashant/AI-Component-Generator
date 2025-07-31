import React, { useRef, useEffect, useState } from "react";
import { Send, Upload, MessageSquare, Copy, Check, Eye, Code2, Download, RefreshCw, Zap } from "lucide-react";
import styles from "../../styles/styleObjects";
import LoadingDots from "../Common/LoadingDots";
import api from "../../utils/api";
import { generateComponent } from "../../api/generate";
import ReactMarkdown from 'react-markdown';
import JSZip from 'jszip';

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
  const [isRefinementMode, setIsRefinementMode] = useState(false);
  const [currentComponentContext, setCurrentComponentContext] = useState(null);
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

  // Function to detect if prompt is a refinement request
  const isRefinementPrompt = (promptText) => {
    const refinementKeywords = [
      'make', 'change', 'modify', 'update', 'add', 'remove', 'delete',
      'larger', 'smaller', 'bigger', 'red', 'blue', 'green', 'color',
      'center', 'left', 'right', 'bold', 'italic', 'shadow', 'border',
      'rounded', 'square', 'hover', 'click', 'animation', 'transition',
      'margin', 'padding', 'width', 'height', 'font', 'size', 'style',
      'button', 'text', 'background', 'darker', 'lighter', 'opacity',
      'fix', 'adjust', 'tweak', 'improve', 'enhance', 'refactor'
    ];
    
    const lowerPrompt = promptText.toLowerCase();
    return refinementKeywords.some(keyword => lowerPrompt.includes(keyword));
  };

  // Function to get the latest component context
  const getLatestComponentContext = () => {
    // Find the most recent AI message with code blocks
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.type === 'ai' && (message.codeBlocks?.length > 0 || message.code)) {
        const activeBlockIndex = activeCodeBlocks[message.id] || 0;
        const codeBlock = message.codeBlocks?.[activeBlockIndex] || { code: message.code, filename: 'Component.jsx' };
        
        return {
          messageId: message.id,
          code: codeBlock.code,
          filename: codeBlock.filename,
          language: codeBlock.language || 'jsx',
          originalPrompt: getOriginalPromptForMessage(message.id)
        };
      }
    }
    return null;
  };

  // Function to get the original prompt that generated a component
  const getOriginalPromptForMessage = (messageId) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.type === 'user') {
        return userMessage.content;
      }
    }
    return '';
  };

  // Function to create refinement prompt
  const createRefinementPrompt = (userRefinement, context) => {
    return `I have an existing ${context.language} component that I'd like to refine. Here's the current code:

\`\`\`${context.language}
${context.code}
\`\`\`

Original requirement: "${context.originalPrompt}"

Please modify this component based on the following refinement request: "${userRefinement}"

Return the complete updated component code, not just the changes. Make sure to maintain the existing functionality while applying the requested modifications.`;
  };

  // Function to download all code blocks as zip
  const downloadCodeAsZip = async (message) => {
    try {
      const zip = new JSZip();
      const codeBlocks = message.codeBlocks || [];
      
      if (codeBlocks.length === 0 && message.code) {
        // Handle legacy single code block
        zip.file("code.jsx", message.code);
      } else {
        // Handle multiple code blocks
        codeBlocks.forEach((block, index) => {
          // Ensure unique filenames
          let filename = block.filename;
          const existingFiles = Object.keys(zip.files);
          let counter = 1;
          
          while (existingFiles.includes(filename)) {
            const nameParts = block.filename.split('.');
            const extension = nameParts.pop();
            const baseName = nameParts.join('.');
            filename = `${baseName}_${counter}.${extension}`;
            counter++;
          }
          
          zip.file(filename, block.code);
        });
      }

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `code-files-${message.id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log("ZIP file downloaded successfully");
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // Check if this is a refinement request
    const isRefinement = isRefinementPrompt(prompt);
    const componentContext = getLatestComponentContext();
    
    let finalPrompt = prompt;
    let isActualRefinement = false;

    // If it looks like a refinement and we have existing component context
    if (isRefinement && componentContext) {
      finalPrompt = createRefinementPrompt(prompt, componentContext);
      isActualRefinement = true;
      setCurrentComponentContext(componentContext);
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: prompt, // Keep original user prompt for display
      timestamp: new Date().toLocaleTimeString(),
      image: image ? URL.createObjectURL(image) : null,
      isRefinement: isActualRefinement,
      refinementContext: isActualRefinement ? componentContext : null
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);
    setPrompt("");
    setImage(null);
    setIsRefinementMode(isActualRefinement);

    try {
      // Create a temporary AI message for streaming updates
      const tempAiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString(),
        codeBlocks: [],
        isRefinementResult: isActualRefinement,
        originalComponentId: isActualRefinement ? componentContext?.messageId : null,
        isStreaming: true
      };

      const messagesWithTemp = [...newMessages, tempAiMessage];
      setMessages(messagesWithTemp);

      // Prepare the request data
      const requestData = { prompt: finalPrompt };
      
      // If this is a refinement request, include the existing code and original prompt
      if (isActualRefinement && componentContext) {
        requestData.existingCode = componentContext.code;
        requestData.originalPrompt = componentContext.originalPrompt;
      }

      // Use the streaming API
      const responseContent = await generateComponent(
        requestData,
        (progressMessage) => {
          // Update the temporary message with progress
          setMessages(prev => prev.map(msg => 
            msg.id === tempAiMessage.id 
              ? { ...msg, content: progressMessage }
              : msg
          ));
        },
        (finalCode) => {
          // Extract multiple code blocks from the final response
          const codeBlocks = extractCodeBlocksFromResponse(finalCode);
          
          // Update the temporary message with final content
          const finalAiMessage = {
            ...tempAiMessage,
            content: finalCode,
            codeBlocks: codeBlocks,
            isStreaming: false
          };

          setMessages(prev => prev.map(msg => 
            msg.id === tempAiMessage.id ? finalAiMessage : msg
          ));
          
          // Set the first code block as the generated code for backward compatibility
          if (codeBlocks.length > 0) {
            setGeneratedCode(codeBlocks[0].code);
            
            // Set the first code block as active by default
            setActiveCodeBlocks(prev => ({
              ...prev,
              [finalAiMessage.id]: 0
            }));
          }

          // Save session with updated messages if we have a current session
          if (currentSession) {
            try {
              const sessionUpdateData = {
                messages: [...newMessages, finalAiMessage],
                code: codeBlocks.length > 0 ? codeBlocks[0].code : (currentSession.code || ""),
                name: currentSession.name === "New Session" ? 
                  (userMessage.content.length > 30 ? userMessage.content.substring(0, 30) + "..." : userMessage.content) : 
                  currentSession.name
              };

              api.put(`/session/sessions/${currentSession._id}`, sessionUpdateData);
              console.log("✅ Session updated with new messages");
            } catch (sessionError) {
              console.error("Failed to save session:", sessionError);
            }
          }
        },
        (errorMessage) => {
          // Update the temporary message with error
          setMessages(prev => prev.map(msg => 
            msg.id === tempAiMessage.id 
              ? { ...msg, content: `Error: ${errorMessage}`, isStreaming: false }
              : msg
          ));
        }
      );

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
      setIsRefinementMode(false);
      setCurrentComponentContext(null);
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

  // Function to start refinement mode manually
  const startRefinementMode = (message) => {
    const activeBlockIndex = activeCodeBlocks[message.id] || 0;
    const codeBlock = message.codeBlocks?.[activeBlockIndex] || { code: message.code, filename: 'Component.jsx' };
    
    const context = {
      messageId: message.id,
      code: codeBlock.code,
      filename: codeBlock.filename,
      language: codeBlock.language || 'jsx',
      originalPrompt: getOriginalPromptForMessage(message.id)
    };
    
    setCurrentComponentContext(context);
    setIsRefinementMode(true);
    
    // Focus on the input textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      textarea.placeholder = `Refine "${context.filename}" (e.g., "Make the button larger and red", "Add a hover effect", "Center the text")`;
    }
  };

  const exitRefinementMode = () => {
    setIsRefinementMode(false);
    setCurrentComponentContext(null);
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.placeholder = "Ask me anything or describe your UI component...";
    }
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
        {/* Refinement indicator */}
        {message.isRefinementResult && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <RefreshCw size={12} />
            <span>Refined Component</span>
            {message.originalComponentId && (
              <span style={{ fontWeight: '500' }}>
                (Updated from previous version)
              </span>
            )}
          </div>
        )}

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
              gap: '8px',
              overflowX: 'auto',
  maxWidth: '100%',
  minWidth: 0,
  paddingBottom: '4px',
  scrollbarWidth: 'thin',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'
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
            
            <div style={{
  ...(styles().codeActions || {}),
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  maxWidth: '100%',
  minWidth: 0,
  paddingBottom: '4px',
  scrollbarWidth: 'thin',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'
}}>

              
              <button
                onClick={() => startRefinementMode(message)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: '1px solid #f59e0b',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#fde68a',
                    borderColor: '#d97706'
                  }
                }}
                title="Refine this component"
              >
                <Zap size={12} />
                <span>Refine</span>
              </button>

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

              {/* Download ZIP button */}
              <button
                onClick={() => downloadCodeAsZip(message)}
                style={styles().downloadButton || {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  border: '1px solid #3b82f6',
                  backgroundColor: '#eff6ff',
                  color: '#3b82f6',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                    borderColor: '#2563eb'
                  }
                }}
                title="Download all code files as ZIP"
              >
                <Download size={12} />
                <span>ZIP</span>
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
    // Handle streaming messages
    if (message.isStreaming) {
      return (
        <div style={styles().messageText}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            <LoadingDots />
            <span>{message.content || 'Generating response...'}</span>
          </div>
        </div>
      );
    }

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
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Refine button for legacy code */}
                <button
                  onClick={() => startRefinementMode(message)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    border: '1px solid #f59e0b',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Refine this component"
                >
                  <Zap size={12} />
                  <span>Refine</span>
                </button>

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
                
                {/* Download ZIP button for legacy code */}
                <button
                  onClick={() => downloadCodeAsZip(message)}
                  style={styles().downloadButton || {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    border: '1px solid #3b82f6',
                    backgroundColor: '#eff6ff',
                    color: '#3b82f6',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Download code as ZIP"
                >
                  <Download size={12} />
                  <span>ZIP</span>
                </button>
              </div>
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

  const renderUserMessage = (message) => {
    return (
      <div>
        {/* Refinement indicator for user messages */}
        {message.isRefinement && (
          <div style={{
            marginBottom: '8px',
            padding: '6px 10px',
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <RefreshCw size={12} />
            <span>Refinement Request</span>
            {message.refinementContext && (
              <span style={{ fontWeight: '500' }}>
                for "{message.refinementContext.filename}"
              </span>
            )}
          </div>
        )}
        
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            style={styles().messageImage}
          />
        )}
        
        <div style={message.type === "user" ? styles().messageTextUser : styles().messageText}>
          {message.content}
        </div>
      </div>
    );
  };

  return (
    <div style={styles().chatPanel}>
      <div style={styles().chatHeader}>
        <h3 style={styles().chatTitle}>
          <MessageSquare size={20} />
          <span>Chat</span>
          {isRefinementMode && currentComponentContext && (
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#92400e',
              backgroundColor: '#fef3c7',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #f59e0b'
            }}>
              <Zap size={12} />
              <span>Refining "{currentComponentContext.filename}"</span>
              <button
                onClick={exitRefinementMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#92400e',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '2px',
                  fontSize: '10px'
                }}
                title="Exit refinement mode"
              >
                ✕
              </button>
            </div>
          )}
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
              {message.type === "user" ? renderUserMessage(message) : renderMessageContent(message)}
              <div style={styles().messageTime}>
                {message.timestamp}
                {message.isStreaming && (
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '11px',
                    color: '#3b82f6',
                    fontStyle: 'italic'
                  }}>
                    • streaming
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles().messageWrapperAi}>
            <div style={{ ...styles().message, ...styles().messageAi }}>
              <LoadingDots />
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {isRefinementMode ? 'Refining component...' : 'Generating component...'}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles().inputArea}>
        {/* Refinement mode indicator */}
        {isRefinementMode && currentComponentContext && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '8px',
            fontSize: '13px',
            color: '#92400e'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Zap size={14} />
              <strong>Refinement Mode Active</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#a16207' }}>
              Refining: <strong>{currentComponentContext.filename}</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#a16207', marginTop: '2px' }}>
              Try: "Make the button larger", "Change color to red", "Add hover effects", etc.
            </div>
          </div>
        )}

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
              placeholder={
                isRefinementMode && currentComponentContext
                  ? `Refine "${currentComponentContext.filename}" (e.g., "Make the button larger and red", "Add a hover effect", "Center the text")`
                  : "Ask me anything or describe your UI component..."
              }
              style={{
                ...styles().textarea,
                ...(isRefinementMode ? {
                  borderColor: '#f59e0b',
                  backgroundColor: '#fffbeb'
                } : {})
              }}
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
              ...(isRefinementMode ? {
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b'
              } : {})
            }}
          >
            {isRefinementMode ? <Zap size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;