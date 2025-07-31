require('dotenv').config();
const axios = require('axios');

async function testGeminiConnection() {
  console.log('🧪 Testing Gemini API connection...');
  console.log('🔑 API Key status:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    console.log('📝 Please create a .env file in the backend directory with:');
    console.log('GEMINI_API_KEY=your-actual-api-key-here');
    return;
  }
  
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

  try {
    console.log('📡 Making request to Gemini API...');
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

    console.log('✅ Gemini API test successful!');
    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', JSON.stringify(response.data, null, 2));
    
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (generatedText) {
      console.log('✅ Generated text:', generatedText);
    } else {
      console.error('❌ No text found in response');
    }

  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
  }
}

testGeminiConnection(); 