const axios = require('axios');

const generateComponent = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedCode = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(generatedCode);
    if (!generatedCode) {
      return res.status(500).json({ error: 'No output returned from Gemini API' });
    }

    res.status(200).json({ code: generatedCode });

  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate component' });
  }
};

module.exports = { generateComponent };
