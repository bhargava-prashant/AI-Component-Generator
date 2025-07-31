// Test React component for verification
export const testReactComponent = `
import React from 'react';

const TestComponent = () => {
  return (
    <div className="test-component">
      <h2>Test React Component</h2>
      <p>This is a test component to verify React rendering works.</p>
      <button className="test-button">Click me!</button>
      <style>
        {\`
          .test-component {
            padding: 20px;
            border: 2px solid #3b82f6;
            border-radius: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
          }
          .test-component h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 600;
          }
          .test-component p {
            margin: 0 0 20px 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .test-button {
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .test-button:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
        \`}
      </style>
    </div>
  );
};

export default TestComponent;
`;

export const testHTMLComponent = `
<div class="html-component">
  <h2>Test HTML Component</h2>
  <p>This is a test HTML component.</p>
  <button class="html-button">HTML Button</button>
  <style>
    .html-component {
      padding: 20px;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      text-align: center;
    }
    .html-component h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 600;
    }
    .html-component p {
      margin: 0 0 20px 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .html-button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .html-button:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  </style>
</div>
`; 