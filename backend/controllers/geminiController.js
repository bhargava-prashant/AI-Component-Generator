const axios = require('axios');

const testGeminiConnection = async (req, res) => {
  try {
    console.log('🧪 Testing Gemini API connection...');
    console.log('🔑 API Key status:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
    
    const testPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Say "Hello, Gemini API is working!"'
            }
          ]
        }
      ]
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      testPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Gemini API test successful');
    res.json({ 
      success: true, 
      message: 'Gemini API is working',
      response: response.data 
    });

  } catch (error) {
    console.error('❌ Gemini API test failed:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data || error.message 
    });
  }
};

// More lenient helper function to truncate existing code only when absolutely necessary
const truncateExistingCode = (code, maxLength = 50000) => { // Increased to 50KB
  if (!code || code.length <= maxLength) return code;
  
  console.log(`📏 Truncating code from ${code.length} to ~${maxLength} characters`);
  
  // Try to find good truncation points in order of preference
  const truncated = code.substring(0, maxLength);
  
  // 1. Try to end at a complete component
  const lastCompleteComponent = truncated.lastIndexOf('export default');
  if (lastCompleteComponent > maxLength * 0.5) {
    const nextSemicolon = truncated.indexOf(';', lastCompleteComponent);
    if (nextSemicolon !== -1 && nextSemicolon < maxLength) {
      return code.substring(0, nextSemicolon + 1);
    }
  }
  
  // 2. Try to end at a complete function/block
  const lastCompleteBlock = truncated.lastIndexOf('};');
  if (lastCompleteBlock > maxLength * 0.7) {
    return code.substring(0, lastCompleteBlock + 2);
  }
  
  // 3. Try to end at a complete line
  const lastNewline = truncated.lastIndexOf('\n');
  if (lastNewline > maxLength * 0.9) {
    return code.substring(0, lastNewline) + '\n// ... (truncated for processing)';
  }
  
  // 4. Last resort: hard truncation
  return truncated + '\n// ... (truncated for processing)';
};

// Helper function to create optimized prompts
const createPrompt = (prompt, existingCode, originalPrompt, isRefinement) => {
  // With 10MB limit, we can be much more generous with existing code
  const truncatedCode = existingCode ? truncateExistingCode(existingCode) : null;
  
  if (isRefinement && truncatedCode) {
    return `CONTEXT: Refining existing React component
EXISTING CODE:
\`\`\`jsx
${truncatedCode}
\`\`\`

ORIGINAL REQUIREMENT: "${originalPrompt || 'Create a React component'}"
REFINEMENT REQUEST: "${prompt}"

INSTRUCTIONS:
- Modify the existing component based on the refinement request
- Keep existing functionality unless specifically asked to change it
- Return ONLY the complete updated React component code
- No explanations, markdown, or descriptive text
- Start with "import React" and end with "export default"
- Include CSS in <style> tag within component
- Keep component self-contained and functional

Return the complete updated component code:`;
  } else {
    return `CREATE: React component for "${prompt}"

REQUIREMENTS:
- Functional React component with hooks
- Include CSS styles in <style> tag within component
- Self-contained and ready to use
- Export as default
- No explanations or markdown
- Start with "import React" and end with "export default"

EXAMPLE FORMAT:
import React, { useState } from 'react';

const ComponentName = () => {
  return (
    <div className="component">
      <h1>Component Title</h1>
      <style>
        {\`
          .component {
            padding: 20px;
            background: #f5f5f5;
          }
        \`}
      </style>
    </div>
  );
};

export default ComponentName;

Return ONLY the component code:`;
  }
};

const generateComponent = async (req, res) => {
  try {
    const { prompt, existingCode, originalPrompt } = req.body;

    // Log payload size for monitoring (but don't reject)
    const payloadSize = JSON.stringify(req.body).length;
    console.log(`📦 Request payload size: ${(payloadSize / 1024).toFixed(2)}KB`);

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // With 10MB limit, only warn for extremely large payloads (>8MB)
    if (payloadSize > 8 * 1024 * 1024) { // 8MB warning threshold
      console.warn(`⚠️ Very large payload detected: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check if this is a refinement request
    const refinementKeywords = [
      'make', 'change', 'modify', 'update', 'add', 'remove', 'delete',
      'larger', 'smaller', 'bigger', 'red', 'blue', 'green', 'color',
      'center', 'left', 'right', 'bold', 'italic', 'shadow', 'border',
      'rounded', 'square', 'hover', 'click', 'animation', 'transition',
      'margin', 'padding', 'width', 'height', 'font', 'size', 'style',
      'button', 'text', 'background', 'darker', 'lighter', 'opacity',
      'fix', 'adjust', 'tweak', 'improve', 'enhance', 'refactor'
    ];
    
    const isRefinement = refinementKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    // Create optimized prompt
    const enhancedPrompt = createPrompt(prompt, existingCode, originalPrompt, isRefinement);

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: enhancedPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 16384, // Keep high token limit
      }
    };

    // Set up SSE headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial status
    res.write(`data: ${JSON.stringify({ 
      status: 'started', 
      message: isRefinement ? 'Refining component...' : 'Generating component...',
      isRefinement,
      payloadSize: `${(payloadSize / 1024).toFixed(2)}KB`
    })}\n\n`);

    try {
      console.log('🔑 Using Gemini API key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
      console.log('🎯 Request type:', isRefinement ? 'Refinement' : 'New component');
      
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000, // 60 second timeout
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      console.log('📡 Gemini API Response Status:', geminiResponse.status);

      const generatedCode = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const finishReason = geminiResponse.data?.candidates?.[0]?.finishReason;
      
      console.log('📝 Generated code length:', generatedCode?.length || 0);
      console.log('🏁 Finish reason:', finishReason);
      
      if (!generatedCode) {
        console.error('❌ No generated code found in response');
        console.error('❌ Response structure:', JSON.stringify(geminiResponse.data, null, 2));
        res.write(`data: ${JSON.stringify({ 
          status: 'error', 
          message: 'No output returned from Gemini API',
          details: geminiResponse.data
        })}\n\n`);
        return res.end();
      }

      // Clean up the generated code
      let cleanCode = generatedCode.trim();
      
      // Remove markdown code blocks if present
      cleanCode = cleanCode.replace(/^```(?:jsx?|javascript)?\n?/gm, '');
      cleanCode = cleanCode.replace(/\n?```$/gm, '');
      
      // Ensure proper import and export
      if (!cleanCode.startsWith('import React')) {
        console.warn('⚠️ Generated code missing React import');
      }
      
      if (!cleanCode.includes('export default')) {
        console.warn('⚠️ Generated code missing default export');
      }

      // Check if response was truncated
      if (finishReason === 'MAX_TOKENS') {
        console.warn('⚠️ Response was truncated due to token limit');
        res.write(`data: ${JSON.stringify({ 
          status: 'complete', 
          code: cleanCode, 
          warning: 'Response may be incomplete due to length limits',
          finishReason: finishReason
        })}\n\n`);
        return res.end();
      }

      // Send the complete response
      res.write(`data: ${JSON.stringify({ 
        status: 'complete', 
        code: cleanCode,
        finishReason: finishReason,
        tokenUsage: geminiResponse.data?.usageMetadata
      })}\n\n`);
      res.end();

    } catch (apiError) {
      console.error('❌ Gemini API error:', apiError.response?.data || apiError.message);
      console.error('❌ Error status:', apiError.response?.status);
      
      let errorMessage = 'Failed to generate component';
      if (apiError.response?.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (apiError.response?.status === 413) {
        errorMessage = 'Request too large. Please reduce the component size.';
      } else if (apiError.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }
      
      res.write(`data: ${JSON.stringify({ 
        status: 'error', 
        message: errorMessage,
        statusCode: apiError.response?.status
      })}\n\n`);
      res.end();
    }

  } catch (error) {
    console.error('❌ Controller error:', error);
    
    // Handle specific error types
    if (error.type === 'entity.too.large') {
      res.write(`data: ${JSON.stringify({ 
        status: 'error', 
        message: 'Request payload too large. Maximum size is 10MB.',
        errorType: 'payload_too_large',
        maxSize: '10MB'
      })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ 
        status: 'error', 
        message: 'Internal server error',
        errorType: 'internal_error'
      })}\n\n`);
    }
    res.end();
  }
};

// Legacy non-streaming endpoint for backward compatibility
const generateComponentLegacy = async (req, res) => {
  try {
    const { prompt, existingCode, originalPrompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Log payload size but don't restrict
    const payloadSize = JSON.stringify(req.body).length;
    console.log(`📦 Legacy endpoint payload size: ${(payloadSize / 1024).toFixed(2)}KB`);

    // Use the same logic as streaming version but return JSON
    const refinementKeywords = [
      'make', 'change', 'modify', 'update', 'add', 'remove', 'delete',
      'larger', 'smaller', 'bigger', 'red', 'blue', 'green', 'color',
      'center', 'left', 'right', 'bold', 'italic', 'shadow', 'border',
      'rounded', 'square', 'hover', 'click', 'animation', 'transition',
      'margin', 'padding', 'width', 'height', 'font', 'size', 'style',
      'button', 'text', 'background', 'darker', 'lighter', 'opacity',
      'fix', 'adjust', 'tweak', 'improve', 'enhance', 'refactor'
    ];
    
    const isRefinement = refinementKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    const enhancedPrompt = createPrompt(prompt, existingCode, originalPrompt, isRefinement);

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: enhancedPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 16384,
      }
    };

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const generatedCode = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = geminiResponse.data?.candidates?.[0]?.finishReason;
    
    if (!generatedCode) {
      return res.status(500).json({ error: 'No output returned from Gemini API' });
    }

    // Clean up code
    let cleanCode = generatedCode.trim();
    cleanCode = cleanCode.replace(/^```(?:jsx?|javascript)?\n?/gm, '');
    cleanCode = cleanCode.replace(/\n?```$/gm, '');

    if (finishReason === 'MAX_TOKENS') {
      return res.status(200).json({ 
        code: cleanCode, 
        warning: 'Response may be incomplete due to length limits' 
      });
    }

    res.status(200).json({ code: cleanCode });

  } catch (error) {
    console.error('❌ Legacy endpoint error:', error.response?.data || error.message);
    
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ 
        error: 'Request payload too large',
        message: 'Maximum payload size is 10MB.',
        maxSize: '10MB'
      });
    }
    
    res.status(500).json({ error: 'Failed to generate component' });
  }
};

module.exports = { 
  generateComponent, 
  generateComponentLegacy, 
  testGeminiConnection
};