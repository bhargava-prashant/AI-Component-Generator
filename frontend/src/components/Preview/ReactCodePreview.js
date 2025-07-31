import React, { useState, useEffect } from 'react';
import ReactPreview from './ReactPreview';

const ReactCodePreview = ({ code, viewMode }) => {
  const [reactCode, setReactCode] = useState('');

  useEffect(() => {
    if (!code || viewMode !== 'react') return;
    setReactCode(code);
  }, [code, viewMode]);

  if (viewMode !== 'react') {
    return null;
  }

  if (!reactCode) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb'
      }}>
        No React code found.
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
        {/* React Code */}
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
            React Code
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
              <code>{reactCode}</code>
            </pre>
          </div>
        </div>

        {/* React Preview */}
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
            Live Preview
          </div>
          <div style={{
            padding: '16px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <ReactPreview code={reactCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactCodePreview; 