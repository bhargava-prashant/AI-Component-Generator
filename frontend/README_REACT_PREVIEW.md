# React Component Preview Feature

This document describes the new React component preview functionality added to the AI Component Generator.

## Features

### 1. React Component Preview
- **Real-time React component rendering** using Babel transformation
- **JSX to JavaScript compilation** on the fly
- **Error handling** with detailed error messages
- **Safe execution environment** for React components

### 2. Multiple Preview Modes
- **Preview**: Shows the rendered component (HTML or React)
- **React**: Dedicated React component preview with proper JSX handling
- **CSS**: Separate CSS preview with syntax highlighting and live preview
- **Code**: Raw code display with syntax highlighting

### 3. CSS Handling
- **Automatic CSS extraction** from React components
- **Separate CSS preview** with live styling
- **CSS syntax highlighting** in dark theme
- **Sample elements** to demonstrate CSS effects

## How It Works

### React Component Rendering
1. **Code Parsing**: The system detects React components by looking for keywords like `function`, `const`, `export`, `React`, `jsx`
2. **JSX Transformation**: Uses Babel to transform JSX to JavaScript
3. **Safe Execution**: Creates a controlled environment to render React components
4. **Error Handling**: Provides detailed error messages if rendering fails

### CSS Extraction
1. **Style Tag Detection**: Extracts CSS from `<style>` tags within components
2. **Template Literal Parsing**: Handles CSS in template literals
3. **Live Preview**: Applies extracted CSS to sample HTML elements

## Components

### ReactPreview.js
- Handles React component rendering
- Uses Babel for JSX transformation
- Provides error handling and loading states
- Manages CSS injection for component styles

### CSSPreview.js
- Displays extracted CSS with syntax highlighting
- Shows live CSS preview with sample elements
- Split view: CSS code on left, preview on right

### PreviewArea.js (Updated)
- Enhanced with multiple view mode buttons
- Conditional rendering based on component type
- Improved UI with React and CSS preview options

## Dependencies Added

```json
{
  "@babel/standalone": "^7.x.x",
  "babel-plugin-transform-react-jsx": "^7.x.x"
}
```

## Usage

### For React Components
1. Generate a React component using the AI
2. The system automatically detects it's a React component
3. Use the view mode buttons to switch between:
   - **Preview**: Rendered component
   - **React**: Dedicated React preview
   - **CSS**: CSS code and preview
   - **Code**: Raw code

### For HTML Components
1. Generate HTML/CSS components
2. Use Preview and Code modes
3. CSS preview available for components with styles

## Error Handling

The system provides comprehensive error handling:
- **JSX Transformation Errors**: Shows Babel compilation errors
- **Component Execution Errors**: Displays runtime errors
- **CSS Parsing Errors**: Handles malformed CSS gracefully
- **Loading States**: Shows loading indicators during processing

## Security

- **Sandboxed Execution**: React components run in a controlled environment
- **Error Boundaries**: Prevents crashes from malformed components
- **CSS Isolation**: Styles are scoped to prevent conflicts

## Testing

Use the demo mode by clicking the "Show Demo" button in the top-right corner to test:
- React component rendering
- CSS extraction and preview
- Multiple view modes
- Error handling

## Future Enhancements

- [ ] Support for React hooks and state management
- [ ] Component props and interactive features
- [ ] Hot reloading for component updates
- [ ] Component library integration
- [ ] Export functionality for generated components 