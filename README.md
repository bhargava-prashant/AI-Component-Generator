# AI Component Generator

A full-stack web application that generates React components using AI (Gemini) with real-time preview, refinement capabilities, and session management.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐           ┌─────────┐           ┌─────────┐
    │ Redis   │           │ MongoDB │           │ Gemini  │
    │ Cache   │           │ Sessions│           │ AI API  │
    └─────────┘           └─────────┘           └─────────┘
```

## 🚀 Features

### Core Functionality
- **AI-Powered Component Generation**: Generate React components using Google's Gemini AI
- **Real-Time Preview**: Live preview of generated components with multiple view modes
- **Component Refinement**: Modify existing components through natural language
- **Session Management**: Save and manage conversation sessions
- **Code Export**: Download components as ZIP files
- **Multiple Preview Modes**: Preview, React, CSS, and Code views

### Preview Modes
- **Preview**: General component preview (HTML/React)
- **React**: Split view with code and live React preview
- **CSS**: Extracted CSS with syntax highlighting and live preview
- **Code**: Raw code display with syntax highlighting

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Babel Standalone**: Client-side JSX transformation
- **React DOM**: Dynamic component rendering
- **Lucide React**: Icon library
- **React Markdown**: Markdown rendering
- **JSZip**: ZIP file generation

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database for sessions and data persistence
- **Redis**: Caching and session storage
- **Google Gemini AI**: AI component generation
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling

### External Services
- **Google Gemini API**: AI-powered code generation
- **MongoDB Atlas**: Cloud database
- **Redis Cloud**: Cloud caching service

## 📁 Project Structure

```
ai_component_generator/
├── backend/
│   ├── controllers/
│   │   ├── geminiController.js    # AI integration logic
│   │   ├── sessionController.js   # Session management
│   │   └── uploadController.js    # File upload handling
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   └── upload.js             # File upload middleware
│   ├── models/
│   │   └── Session.js            # MongoDB session model
│   ├── routes/
│   │   ├── gemini.js             # AI API routes
│   │   ├── sessions.js           # Session routes
│   │   └── upload.js             # Upload routes
│   ├── utils/
│   │   └── redis.js              # Redis connection and utilities
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── generate.js       # API client functions
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   └── ChatPanel.js  # Main chat interface
│   │   │   ├── Common/
│   │   │   │   └── LoadingDots.js # Loading animation
│   │   │   ├── Layouts/
│   │   │   │   └── MainLayout.js  # Main app layout
│   │   │   └── Preview/
│   │   │       ├── PreviewArea.js    # Preview container
│   │   │       ├── ReactPreview.js   # React component renderer
│   │   │       ├── CSSPreview.js     # CSS preview
│   │   │       └── ReactCodePreview.js # Split code/preview view
│   │   ├── hooks/
│   │   │   └── useSessionUpdate.js   # Session update hook
│   │   ├── styles/
│   │   │   └── styleObjects.js       # Styled components
│   │   ├── utils/
│   │   │   ├── api.js                # API utilities
│   │   │   └── reactRenderer.js      # React rendering utilities
│   │   ├── App.js                     # Main app component
│   │   └── index.js                   # React entry point
│   └── package.json                   # Frontend dependencies
├── package.json                       # Root dependencies
└── README.md                          # This file
```

## 🔧 Backend Architecture

### Server Setup (`backend/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const redisClient = require('./utils/redis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/upload', require('./routes/upload'));
```

### Redis Integration (`backend/utils/redis.js`)
Redis is used for:
- **Session Caching**: Store user sessions for faster access
- **Rate Limiting**: Prevent API abuse
- **Component Caching**: Cache generated components
- **Real-time Updates**: Enable live collaboration features

```javascript
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD
});

// Cache session data
const cacheSession = async (sessionId, data) => {
  await redisClient.setEx(`session:${sessionId}`, 3600, JSON.stringify(data));
};

// Retrieve cached session
const getCachedSession = async (sessionId) => {
  const cached = await redisClient.get(`session:${sessionId}`);
  return cached ? JSON.parse(cached) : null;
};
```

### AI Controller (`backend/controllers/geminiController.js`)
Handles communication with Google Gemini AI:

```javascript
const generateComponent = async (req, res) => {
  const { prompt, existingCode, originalPrompt } = req.body;
  
  // Detect refinement requests
  const isRefinement = refinementKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );
  
  if (isRefinement && existingCode) {
    // Send refinement prompt with existing code context
    const enhancedPrompt = `I have an existing React component...`;
  } else {
    // Send new component generation prompt
    const enhancedPrompt = `Create a React component for: "${prompt}"`;
  }
  
  // Stream response to client
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
};
```

### Session Management (`backend/controllers/sessionController.js`)
Manages user sessions with MongoDB and Redis:

```javascript
// Create new session
const createSession = async (req, res) => {
  const session = new Session({
    name: req.body.name || 'New Session',
    messages: req.body.messages || [],
    code: req.body.code || ''
  });
  
  await session.save();
  
  // Cache in Redis
  await cacheSession(session._id.toString(), session);
  
  res.json(session);
};
```

## 🎨 Frontend Architecture

### Main Layout (`frontend/src/components/Layouts/MainLayout.js`)
```javascript
const MainLayout = ({ children }) => {
  return (
    <div style={styles().app}>
      <ChatPanel 
        messages={messages}
        setMessages={setMessages}
        currentSession={currentSession}
        setGeneratedCode={setGeneratedCode}
      />
      <PreviewArea 
        generatedCode={generatedCode}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );
};
```

### Chat Panel (`frontend/src/components/Chat/ChatPanel.js`)
Handles user interactions and AI communication:

```javascript
const handleSubmit = async () => {
  // Prepare request data
  const requestData = { prompt: finalPrompt };
  
  // Include existing code for refinement
  if (isActualRefinement && componentContext) {
    requestData.existingCode = componentContext.code;
    requestData.originalPrompt = componentContext.originalPrompt;
  }
  
  // Stream response from AI
  const responseContent = await generateComponent(
    requestData,
    (progressMessage) => {
      // Update UI with streaming progress
    },
    (finalCode) => {
      // Handle final response
      setGeneratedCode(finalCode);
    }
  );
};
```

### React Preview (`frontend/src/components/Preview/ReactPreview.js`)
Renders React components with CSS injection:

```javascript
const ReactPreview = ({ code }) => {
  const containerRef = useRef(null);
  const styleRef = useRef(null);
  const rootRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Extract CSS from component
    const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const css = styleMatch ? styleMatch[1] : '';
    
    // Compile JSX to JavaScript
    const compiled = Babel.transform(codeWithoutStyle, {
      presets: ['react'],
      plugins: ['transform-react-jsx'],
    }).code;
    
    // Inject React hooks
    const Component = new Function(
      'React', 'useState', 'useEffect', /* ... other hooks */,
      compiled + `; return ${componentName};`
    )(React, React.useState, React.useEffect, /* ... */);
    
    // Apply CSS and render
    if (css) {
      styleRef.current = document.createElement('style');
      styleRef.current.textContent = css;
      document.head.appendChild(styleRef.current);
    }
    
    rootRef.current = createRoot(containerRef.current);
    rootRef.current.render(React.createElement(Component));
  }, [code]);
};
```

## 🔄 Data Flow

### Component Generation Flow
1. **User Input**: User types prompt in chat interface
2. **Frontend Processing**: ChatPanel processes input and detects refinement mode
3. **API Request**: Sends request to backend with prompt and context
4. **Backend Processing**: GeminiController processes request and calls AI
5. **AI Response**: Gemini AI generates component code
6. **Streaming**: Response streamed back to frontend
7. **Preview Rendering**: ReactPreview renders component with CSS
8. **Session Update**: Session saved to MongoDB and cached in Redis

### Refinement Flow
1. **User Refinement**: User clicks "Refine" button on existing component
2. **Context Extraction**: Frontend extracts existing code and original prompt
3. **Refinement Request**: Sends refinement request with context to backend
4. **AI Processing**: Backend sends existing code + refinement prompt to AI
5. **Code Update**: AI modifies existing code based on refinement request
6. **Preview Update**: Updated component rendered in preview

## 🗄️ Database Schema

### Session Model (`backend/models/Session.js`)
```javascript
const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [{
    id: Number,
    type: String, // 'user' or 'ai'
    content: String,
    timestamp: String,
    codeBlocks: [{
      code: String,
      filename: String,
      language: String
    }]
  }],
  code: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 🔐 Environment Variables

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
REDIS_PASSWORD=your_redis_password
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Redis Cloud account
- Google Gemini API key

### Backend Deployment
```bash
cd backend
npm install
npm start
```

### Frontend Deployment
```bash
cd frontend
npm install
npm start
```

### Production Deployment
1. **Backend**: Deploy to Heroku, Vercel, or AWS
2. **Frontend**: Deploy to Netlify, Vercel, or AWS S3
3. **Database**: Use MongoDB Atlas
4. **Cache**: Use Redis Cloud
5. **Environment**: Set production environment variables

## 🔧 Configuration

### Redis Configuration
```javascript
// backend/utils/redis.js
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  retry_strategy: (options) => {
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});
```

### CORS Configuration
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Performance Optimizations

### Redis Caching Strategy
- **Session Caching**: Cache user sessions for 1 hour
- **Component Caching**: Cache generated components for 30 minutes
- **Rate Limiting**: Implement Redis-based rate limiting
- **Real-time Updates**: Use Redis pub/sub for live collaboration

### Frontend Optimizations
- **Code Splitting**: Lazy load components
- **Memoization**: Use React.memo for expensive components
- **Debouncing**: Debounce user input for better performance
- **Virtual Scrolling**: For large message lists

## 🔒 Security Considerations

### API Security
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize user inputs
- **CORS Configuration**: Restrict cross-origin requests
- **Environment Variables**: Secure API keys

### Frontend Security
- **XSS Prevention**: Sanitize dynamic content
- **Content Security Policy**: Restrict resource loading
- **HTTPS**: Use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **Redis Connection Error**
   ```bash
   # Check Redis connection
   redis-cli ping
   ```

2. **MongoDB Connection Error**
   ```bash
   # Check MongoDB connection string
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

3. **Gemini API Error**
   ```bash
   # Verify API key
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://generativelanguage.googleapis.com/v1beta/models
   ```

4. **React Preview Issues**
   - Check browser console for Babel errors
   - Verify CSS extraction regex
   - Ensure React hooks are properly injected


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🙏 Acknowledgments

- Google Gemini AI for component generation
- MongoDB for database services
- Redis for caching solutions

---

**Version**: 1.0.0  
**Last Updated**: July 2025  
**Maintainer**: Prashant Bhargava 
