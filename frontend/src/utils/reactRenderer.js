import * as Babel from '@babel/standalone';

// Extract code from markdown code blocks
const extractCodeFromMarkdown = (text) => {
  // Remove markdown code blocks
  const codeBlockRegex = /```(?:jsx?|javascript|js|react)?\s*([\s\S]*?)```/g;
  const matches = [...text.matchAll(codeBlockRegex)];
  
  if (matches.length > 0) {
    // Return the first code block found
    return matches[0][1].trim();
  }
  
  // If no code blocks found, try to find import statements and React code
  const lines = text.split('\n');
  const codeStartIndex = lines.findIndex(line => 
    line.includes('import React') || 
    line.includes('import {') || 
    line.includes('const ') && line.includes('= () =>') ||
    line.includes('function ') && line.includes('(')
  );
  
  if (codeStartIndex !== -1) {
    // Extract from the first import or component definition
    return lines.slice(codeStartIndex).join('\n').trim();
  }
  
  // If still no code found, return the original text
  return text.trim();
};

// Check if code is incomplete and try to fix it
const fixIncompleteCode = (code) => {
  // Only add export if missing, don't truncate code
  if (!code.includes('export default')) {
    console.warn('⚠️ Adding missing export statement...');
    // Try to find the component name
    let componentName = 'ReactComponent';
    const componentMatch = code.match(/const\s+(\w+)\s*=/);
    if (componentMatch) {
      componentName = componentMatch[1];
    }
    
    return code + '\n\nexport default ' + componentName + ';';
  }
  
  return code;
};

// Transform JSX to JavaScript
const transformJSX = (code) => {
  let cleanCode;
  try {
    // First extract code from markdown if present
    cleanCode = extractCodeFromMarkdown(code);
    
    // Try to fix incomplete code
    cleanCode = fixIncompleteCode(cleanCode);
    
    console.log('🔍 Extracted code for transformation:', cleanCode.substring(0, 200) + '...');
    
    const result = Babel.transform(cleanCode, {
      presets: ['react'],
      plugins: ['transform-react-jsx']
    });
    return result.code;
  } catch (error) {
    console.error('Babel transformation error:', error);
    console.error('Code that failed to transform:', cleanCode || 'No code extracted');
    throw new Error(`JSX transformation failed: ${error.message}. Please check if the code contains valid React/JSX syntax.`);
  }
};

// Create a safe execution environment for React components
const createComponentRenderer = (componentCode, cssCode = '') => {
  try {
    // Transform the JSX code
    const transformedCode = transformJSX(componentCode);
    
    // Create a function that returns the component
    const componentFunction = new Function(
      'React',
      'css',
      `
        ${transformedCode}
        return React.createElement(Component || (() => React.createElement('div', null, 'Component not found')));
      `
    );
    
    return (React) => {
      try {
        // Create a style element for CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = cssCode;
        document.head.appendChild(styleElement);
        
        // Execute the component function
        const Component = componentFunction(React, cssCode);
        return React.createElement(Component);
      } catch (error) {
        console.error('Component execution error:', error);
        return React.createElement('div', { 
          style: { 
            color: 'red', 
            padding: '20px', 
            border: '1px solid red',
            borderRadius: '4px'
          } 
        }, `Error rendering component: ${error.message}`);
      }
    };
  } catch (error) {
    console.error('Component creation error:', error);
    
    // Try to create a simple fallback component
    try {
      return (React) => React.createElement('div', {
        style: {
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb',
          color: '#374151'
        }
      }, [
        React.createElement('h3', { key: 'title' }, 'Component Preview'),
        React.createElement('p', { key: 'message' }, 'The generated component could not be rendered due to syntax errors.'),
        React.createElement('details', { key: 'error' }, [
          React.createElement('summary', { key: 'summary' }, 'Error Details'),
          React.createElement('pre', { 
            key: 'error-text',
            style: {
              fontSize: '12px',
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              padding: '8px',
              borderRadius: '4px',
              overflow: 'auto'
            }
          }, error.message)
        ])
      ]);
    } catch (fallbackError) {
      console.error('Fallback component creation failed:', fallbackError);
      return (React) => React.createElement('div', { 
        style: { 
          color: 'red', 
          padding: '20px', 
          border: '1px solid red',
          borderRadius: '4px'
        } 
      }, `Failed to create component: ${error.message}`);
    }
  }
};

// Extract CSS from component code
const extractCSS = (code) => {
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (cssMatch) {
    return cssMatch[1];
  }
  
  // Look for CSS in template literals or strings
  const cssInCode = code.match(/css\s*=\s*`([\s\S]*?)`/i) || 
                   code.match(/css\s*=\s*['"]([\s\S]*?)['"]/i);
  if (cssInCode) {
    return cssInCode[1];
  }
  
  return '';
};

// Parse component code to separate React component and CSS
const parseComponentCode = (code) => {
  // First extract code from markdown if present
  const cleanCode = extractCodeFromMarkdown(code);
  
  // Remove CSS from the component code
  const componentCode = cleanCode.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  const cssCode = extractCSS(cleanCode);
  
  return {
    componentCode: componentCode.trim(),
    cssCode: cssCode.trim()
  };
};

export { createComponentRenderer, parseComponentCode, extractCSS }; 