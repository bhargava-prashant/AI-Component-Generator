import React, { useState } from 'react';
import './SidePanelChat.css';
import axios from 'axios';

const SidePanelChat = ({ onComponentGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!prompt) return;
    setLoading(true);
  
    try {
      const res = await axios.post('http://localhost:5000/api/generate', {
        prompt: prompt,
      });
  
      const { code } = res.data;
      onComponentGenerated(code);
    } catch (error) {
      console.error('Error generating component:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="side-panel">
      <h2>💬 AI UI Generator</h2>
      <textarea
        rows="6"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your UI component..."
      />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
};

export default SidePanelChat;
