const express = require('express');
const { encryptMessage, decryptMessage, listMethods } = require('../controllers/cipherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/methods', authMiddleware, listMethods);
router.post('/encrypt', authMiddleware, encryptMessage);
router.post('/decrypt', authMiddleware, decryptMessage);

module.exports = router;


