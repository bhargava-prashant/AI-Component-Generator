import React, { useState } from 'react';
import SidePanelChat from './SidePanelChat';
import './Viewport.css';

const Viewport = () => {
  const [generatedCode, setGeneratedCode] = useState('');

  return (
    <div className="viewport-container">
      <SidePanelChat onComponentGenerated={setGeneratedCode} />
      <div className="preview-pane">
        <h2>🔍 Preview</h2>
        <div
          className="preview-box"
          dangerouslySetInnerHTML={{ __html: generatedCode }}
        />
      </div>
    </div>
  );
};

export default Viewport;
