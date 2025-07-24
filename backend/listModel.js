// listModels.js
const axios = require('axios');
require('dotenv').config(); // Optional, for reading GEMINI_API_KEY from .env

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'PASTE_YOUR_API_KEY_HERE';

const listModel = async () => {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );

    const models = response.data.models;
    console.log('\n📦 Available Models:\n');

    models.forEach((model, i) => {
      const name = model.name;
      const methods = model.supportedGenerationMethods || [];
      console.log(`${i + 1}. ${name}`);
      console.log(`   ↳ Supports: ${methods.join(', ') || 'None'}`);
    });
  } catch (err) {
    console.error('\n❌ Error fetching models:\n', err.response?.data || err.message);
  }
};

listModel();
