import React, { useState } from 'react';
import { testReactComponent, testHTMLComponent } from '../../utils/testComponent';
import ReactPreview from './ReactPreview';
import CSSPreview from './CSSPreview';

const DemoPreview = () => {
  const [selectedComponent, setSelectedComponent] = useState('react');
  const [viewMode, setViewMode] = useState('preview');

  const components = {
    react: testReactComponent,
    html: testHTMLComponent
  };

  const currentCode = components[selectedComponent];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#374151' }}>
        React Component Preview Demo
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: '500' }}>Select Component:</label>
        <select 
          value={selectedComponent} 
          onChange={(e) => setSelectedComponent(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white'
          }}
        >
          <option value="react">React Component</option>
          <option value="html">HTML Component</option>
        </select>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setViewMode('preview')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: viewMode === 'preview' ? '#3b82f6' : '#f3f4f6',
            color: viewMode === 'preview' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Preview
        </button>
        {selectedComponent === 'react' && (
          <>
            <button
              onClick={() => setViewMode('react')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'react' ? '#3b82f6' : '#f3f4f6',
                color: viewMode === 'react' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              React
            </button>
            <button
              onClick={() => setViewMode('css')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'css' ? '#3b82f6' : '#f3f4f6',
                color: viewMode === 'css' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              CSS
            </button>
          </>
        )}
        <button
          onClick={() => setViewMode('code')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: viewMode === 'code' ? '#3b82f6' : '#f3f4f6',
            color: viewMode === 'code' ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Code
        </button>
      </div>

      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        minHeight: '400px'
      }}>
        {viewMode === 'preview' ? (
          <div
            style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '8px',
              margin: '10px'
            }}
            dangerouslySetInnerHTML={{ __html: selectedComponent === 'html' ? currentCode : '' }}
          >
            {selectedComponent === 'react' && (
              <ReactPreview code={currentCode} viewMode="react" />
            )}
          </div>
        ) : viewMode === 'react' ? (
          <ReactPreview code={currentCode} viewMode={viewMode} />
        ) : viewMode === 'css' ? (
          <CSSPreview code={currentCode} viewMode={viewMode} />
        ) : (
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            margin: '10px',
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
              Code
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
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPreview; 