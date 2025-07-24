import React, { useEffect, useRef } from 'react';
import './ComponentPreview.css';

export default function ComponentPreview({ code }) {
  const iframeRef = useRef();

  useEffect(() => {
    if (!code.jsx) return;

    const document = iframeRef.current.contentDocument;
    const html = `
      <style>${code.css || ''}</style>
      <div id="root"></div>
      <script type="text/babel">
        const Component = () => (${code.jsx});
        ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
      </script>
    `;

    document.open();
    document.write(`
      <html>
        <head>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        </head>
        <body>${html}</body>
      </html>
    `);
    document.close();
  }, [code]);

  return <iframe ref={iframeRef} className="preview-frame" />;
}