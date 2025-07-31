import React from "react";
import { Eye, Code, Sparkles, AlertTriangle, Palette, Zap } from "lucide-react";
import styles from "../../styles/styleObjects";
import ReactPreview from "./ReactPreview";
import CSSPreview from "./CSSPreview";
import ReactCodePreview from "./ReactCodePreview";

function PreviewArea({ generatedCode, viewMode, setViewMode }) {
  const isReactComponent = generatedCode && (
    generatedCode.includes('function ') || 
    generatedCode.includes('const ') || 
    generatedCode.includes('export') ||
    generatedCode.includes('React') ||
    generatedCode.includes('jsx')
  );

  const renderPreview = () => {
    if (!generatedCode) return null;

    try {
      // For React components, use the new ReactPreview component
      if (isReactComponent) {
        return <ReactPreview code={generatedCode} viewMode={viewMode} />;
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
            {isReactComponent && (
              <>
                <button
                  onClick={() => setViewMode("react")}
                  style={{
                    ...styles().viewModeButton,
                    ...(viewMode === "react"
                      ? styles().viewModeButtonActive
                      : {}),
                  }}
                >
                  <Zap size={16} />
                  <span>React</span>
                </button>
                <button
                  onClick={() => setViewMode("css")}
                  style={{
                    ...styles().viewModeButton,
                    ...(viewMode === "css"
                      ? styles().viewModeButtonActive
                      : {}),
                  }}
                >
                  <Palette size={16} />
                  <span>CSS</span>
                </button>
              </>
            )}
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
              ) : viewMode === "react" ? (
                <ReactCodePreview code={generatedCode} viewMode={viewMode} />
              ) : viewMode === "css" ? (
                <CSSPreview code={generatedCode} viewMode={viewMode} />
              ) : viewMode === "code" ? (
                <div style={styles().codeBox}>
                  <pre style={styles().codeText}>
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              ) : (
                renderPreview()
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