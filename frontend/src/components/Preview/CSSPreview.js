import React, { useState, useEffect } from 'react';
import { extractCSS } from '../../utils/reactRenderer';

const CSSPreview = ({ code, viewMode }) => {
  const [cssCode, setCssCode] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (!code || viewMode !== 'css') return;

    const extractedCSS = extractCSS(code);
    setCssCode(extractedCSS);

    // Create a simple HTML preview with the CSS applied
    if (extractedCSS) {
      const htmlPreview = `
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: white;">
          <h3>CSS Preview</h3>
          <div class="preview-container">
            <div class="preview-element">Sample Element</div>
            <button class="preview-button">Sample Button</button>
            <div class="preview-card">
              <h4>Sample Card</h4>
              <p>This is a sample card with applied styles.</p>
            </div>
          </div>
        </div>
      `;
      setPreviewHtml(htmlPreview);
    }
  }, [code, viewMode]);

  if (viewMode !== 'css') {
    return null;
  }

  if (!cssCode) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb'
      }}>
        No CSS found in the component code.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        gap: '20px',
        minHeight: 0
      }}>
        {/* CSS Code */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#334155',
            borderBottom: '1px solid #475569',
            color: '#f1f5f9',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            CSS Code
          </div>
          <div style={{
            padding: '16px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <pre style={{
              margin: 0,
              color: '#f1f5f9',
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
            }}>
              <code>{cssCode}</code>
            </pre>
          </div>
        </div>

        {/* CSS Preview */}
        <div style={{ 
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            CSS Preview
          </div>
          <div style={{
            padding: '16px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <style>{cssCode}</style>
            <div 
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSPreview; 