const express = require('express');
const router = express.Router();

// POST /api/generate
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Dummy response for now (Replace with actual OpenAI logic)
    const generatedCode = `<div>Hello from the backend! You asked: ${prompt}</div>`;

    res.json({ code: generatedCode });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
