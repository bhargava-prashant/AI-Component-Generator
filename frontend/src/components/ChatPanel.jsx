import React, { useState } from 'react';
import './ChatPanel.css';

export default function ChatPanel({ setGeneratedCode }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (image) formData.append('image', image);

    const res = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setGeneratedCode(data);
    setPrompt('');
    setImage(null);
  };

  return (
    <div className="chat-panel">
      <textarea
        placeholder="Describe your component..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleSubmit}>Generate</button>
    </div>
  );
}