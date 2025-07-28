import React from "react";
import { Eye, Code, Sparkles, AlertTriangle } from "lucide-react";
import styles from "../../styles/styleObjects";

function PreviewArea({ generatedCode, viewMode, setViewMode }) {
  const renderPreview = () => {
    if (!generatedCode) return null;

    try {
      // For React components, we need to transform JSX to HTML
      // This is a simplified approach - you might want to use a proper JSX transformer
      if (generatedCode.includes('function ') || generatedCode.includes('const ') || generatedCode.includes('export')) {
        return (
          <div style={styles().previewBox}>
            <div style={styles().previewError}>
              <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
              <p>React component preview requires a proper build setup.</p>
              <p>Switch to Code view to see the component code.</p>
            </div>
          </div>
        );
      }
      
      // For HTML content
      return (
        <div
          style={styles().previewBox}
          dangerouslySetInnerHTML={{ __html: generatedCode }}
        />
      );
    } catch (error) {
      return (
        <div style={styles().previewBox}>
          <div style={styles().previewError}>
            <AlertTriangle size={24} style={{ color: '#ef4444' }} />
            <p>Error rendering preview</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>
              {error.message}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={styles().previewArea}>
      <div style={styles().previewHeader}>
        <h3 style={styles().previewTitle}>Preview</h3>
        {generatedCode && (
          <div style={styles().viewModeToggle}>
            <button
              onClick={() => setViewMode("preview")}
              style={{
                ...styles().viewModeButton,
                ...(viewMode === "preview"
                  ? styles().viewModeButtonActive
                  : {}),
              }}
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode("code")}
              style={{
                ...styles().viewModeButton,
                ...(viewMode === "code"
                  ? styles().viewModeButtonActive
                  : {}),
              }}
            >
              <Code size={16} />
              <span>Code</span>
            </button>
          </div>
        )}
      </div>
      <div style={styles().previewContent}>
        {generatedCode ? (
          <div style={{ height: "100%" }}>
            {viewMode === "preview" ? (
              renderPreview()
            ) : (
              <div style={styles().codeBox}>
                <pre style={styles().codeText}>
                  <code>{generatedCode}</code>
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div style={styles().emptyState}>
            <div style={styles().emptyStateContent}>
              <Sparkles style={styles().emptyStateIcon} />
              <h3 style={styles().emptyStateTitle}>
                No component generated yet
              </h3>
              <p style={styles().emptyStateText}>
                Start a conversation to generate your first UI component
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewArea;