// components/PropertyPanel.jsx
import React from 'react';
import { useEditorStore } from '../store/editorStore';

const PropertyPanel = () => {
  const { selectedUid, uiTree, updateElementProperty } = useEditorStore();
  if (!selectedUid || !uiTree[selectedUid]) return null;

  const selectedElement = uiTree[selectedUid];

  const handleChange = (prop, value) => {
    updateElementProperty(selectedUid, prop, value);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: '30px',
        zIndex: 1000,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        minWidth: '250px',
      }}
    >
      <h4 style={{ marginBottom: '10px' }}>Edit Properties</h4>
      <label>
        Text:
        <input
          type="text"
          value={selectedElement.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
        />
      </label>
      <label>
        Padding:
        <input
          type="range"
          min="0"
          max="50"
          value={parseInt(selectedElement.style?.padding || 0)}
          onChange={(e) => handleChange('padding', `${e.target.value}px`)}
        />
      </label>
      <label>
        Font Size:
        <input
          type="range"
          min="10"
          max="36"
          value={parseInt(selectedElement.style?.fontSize || 16)}
          onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
        />
      </label>
      <label>
        Text Color:
        <input
          type="color"
          value={selectedElement.style?.color || '#000000'}
          onChange={(e) => handleChange('color', e.target.value)}
        />
      </label>
      <label>
        Background Color:
        <input
          type="color"
          value={selectedElement.style?.backgroundColor || '#ffffff'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </label>
      <label>
        Border Radius:
        <input
          type="range"
          min="0"
          max="50"
          value={parseInt(selectedElement.style?.borderRadius || 0)}
          onChange={(e) => handleChange('borderRadius', `${e.target.value}px`)}
        />
      </label>
      <label>
        Box Shadow:
        <input
          type="text"
          value={selectedElement.style?.boxShadow || ''}
          onChange={(e) => handleChange('boxShadow', e.target.value)}
        />
      </label>
    </div>
  );
};

export default PropertyPanel;
