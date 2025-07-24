const express = require('express');
const router = express.Router();
const { generateComponent } = require('../controllers/geminiController');

router.post('/', generateComponent);

module.exports = router;
