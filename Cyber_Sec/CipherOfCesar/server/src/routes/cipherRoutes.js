const express = require('express');
const { encryptMessage, decryptMessage } = require('../controllers/cipherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/encrypt', authMiddleware, encryptMessage);
router.post('/decrypt', authMiddleware, decryptMessage);

module.exports = router;


