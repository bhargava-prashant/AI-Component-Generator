import React, { useEffect, useRef } from 'react';
import * as Babel from '@babel/standalone';

const ReactPreview = ({ code }) => {
  const containerRef = useRef(null);
  const styleRef = useRef(null);
  const rootRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!code) return;

    // Extract <style>...</style> with more robust regex
    const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = styleMatch ? styleMatch[1] : '';
    const codeWithoutStyle = code.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove import and export statements since we're evaluating in non-module context
    const codeWithoutImports = codeWithoutStyle.replace(/import\s+.*?from\s+['"][^'"]*['"];?\n?/g, '');
    const codeWithoutExports = codeWithoutImports.replace(/export\s+default\s+.*?;?\n?/g, '');

    // Find the component name from the code
    let componentName = 'Component';
    const componentMatch = codeWithoutExports.match(/const\s+(\w+)\s*=/);
    if (componentMatch) {
      componentName = componentMatch[1];
    }

    // Compile JSX to JS
    let compiled;
    try {
      compiled = Babel.transform(codeWithoutExports, {
        presets: ['react'],
        plugins: ['transform-react-jsx'],
      }).code;
    } catch (err) {
      if (containerRef.current && isMountedRef.current)
        containerRef.current.innerHTML = `<pre style="color:red;">Babel error: ${err.message}</pre>`;
      return;
    }

    // Evaluate the code to get the component
    let Component;
    try {
      // eslint-disable-next-line no-new-func
      Component = new Function(
        'React', 
        'useState', 
        'useEffect', 
        'useRef', 
        'useCallback', 
        'useMemo', 
        'useContext', 
        'useReducer',
        compiled + `; return ${componentName} || exports.default || module.exports;`
      )(
        React, 
        React.useState, 
        React.useEffect, 
        React.useRef, 
        React.useCallback, 
        React.useMemo, 
        React.useContext, 
        React.useReducer
      );
    } catch (err) {
      if (containerRef.current && isMountedRef.current)
        containerRef.current.innerHTML = `<pre style="color:red;">Eval error: ${err.message}</pre>`;
      return;
    }

    // Mount the component with proper cleanup
    const mountComponent = async () => {
      try {
        // Check if component is still mounted
        if (!isMountedRef.current) return;

        // Clean up previous render safely
        if (rootRef.current) {
          try {
            rootRef.current.unmount();
          } catch (unmountError) {
            console.warn('Error during unmount:', unmountError);
          }
          rootRef.current = null;
        }
        
        // Clear container safely
        if (containerRef.current && isMountedRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        // Remove previous styles safely
        if (styleRef.current) {
          try {
            if (styleRef.current.parentNode) {
              styleRef.current.parentNode.removeChild(styleRef.current);
            }
          } catch (styleError) {
            console.warn('Error removing style element:', styleError);
          }
          styleRef.current = null;
        }
        
        // Add new styles if CSS exists
        if (css && css.trim() && isMountedRef.current) {
          styleRef.current = document.createElement('style');
          styleRef.current.id = `react-preview-styles-${Date.now()}`;
          styleRef.current.textContent = css;
          document.head.appendChild(styleRef.current);
          
          // Small delay to ensure styles are applied
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Check if still mounted before creating root
        if (!isMountedRef.current) return;
        
        // Create new root and render
        const { createRoot } = await import('react-dom/client');
        
        // Final check before rendering
        if (!isMountedRef.current || !containerRef.current) return;
        
        rootRef.current = createRoot(containerRef.current);
        rootRef.current.render(React.createElement(Component));
      } catch (error) {
        console.error('Error mounting component:', error);
        if (containerRef.current && isMountedRef.current) {
          containerRef.current.innerHTML = `<pre style="color:red;">Mount error: ${error.message}</pre>`;
        }
      }
    };

    mountComponent();

    return () => {
      // Mark as unmounted
      isMountedRef.current = false;
      
      // Cleanup function with safe checks
      if (rootRef.current) {
        try {
          rootRef.current.unmount();
        } catch (unmountError) {
          console.warn('Error during cleanup unmount:', unmountError);
        }
        rootRef.current = null;
      }
      
      if (styleRef.current) {
        try {
          if (styleRef.current.parentNode) {
            styleRef.current.parentNode.removeChild(styleRef.current);
          }
        } catch (styleError) {
          console.warn('Error during cleanup style removal:', styleError);
        }
        styleRef.current = null;
      }
    };
  }, [code]);

  // Reset mounted flag when component mounts
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return <div ref={containerRef} style={{ minHeight: 300, width: '100%' }} />;
};

export default ReactPreview; 