// components/editor/CanvasPreview.jsx
import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import PropertyPanel from '../PropertyPanel';

const CanvasPreview = () => {
  const { uiTree, selectedUid, selectElement, deselectElement } = useEditorStore();

  const handleClick = (e, uid) => {
    e.stopPropagation();
    selectElement(uid);
  };

  return (
    <div onClick={deselectElement} style={{ position: 'relative', padding: '2rem' }}>
      {Object.entries(uiTree).map(([uid, node]) => (
        <div
          key={uid}
          data-uid={uid}
          onClick={(e) => handleClick(e, uid)}
          style={{
            ...node.style,
            border: selectedUid === uid ? '2px solid blue' : '1px dashed gray',
            marginBottom: '1rem',
            padding: '1rem',
            cursor: 'pointer',
          }}
        >
          {node.text || `Element ${uid}`}
        </div>
      ))}
      <PropertyPanel />
    </div>
  );
};

export default CanvasPreview;
