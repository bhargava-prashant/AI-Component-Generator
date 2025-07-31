const express = require('express');
const router = express.Router();
const { generateComponent, generateComponentLegacy, testGeminiConnection } = require('../controllers/geminiController');

router.post('/', generateComponent);
router.post('/legacy', generateComponentLegacy);
router.get('/test', testGeminiConnection);

module.exports = router;
