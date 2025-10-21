const crypto = require('crypto');
const Token = require('../models/Token');
const { encrypt, decrypt } = require('../utils/caesar');

const generateHash = (message, shift, userId) => {
  const hash = crypto
    .createHash('sha256')
    .update(`${userId}:${shift}:${message}:${Date.now()}`)
    .digest('hex');

  return hash;
};

const encryptMessage = async (req, res) => {
  try {
    const { message, shift } = req.body;
    const userId = req.user.id;

    if (typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!Number.isInteger(shift)) {
      return res.status(400).json({ message: 'Shift must be an integer' });
    }

    const encrypted = encrypt(message, shift);
    const hash = generateHash(message, shift, userId);

    await Token.create({ hash, shift, owner: userId, used: false });

    res.json({ encrypted, hash });
  } catch (error) {
    console.error('Encrypt error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const decryptMessage = async (req, res) => {
  try {
    const { encrypted, hash } = req.body;
    const userId = req.user.id;

    if (typeof encrypted !== 'string' || encrypted.trim() === '') {
      return res.status(400).json({ message: 'Encrypted message is required' });
    }

    if (typeof hash !== 'string' || hash.trim() === '') {
      return res.status(400).json({ message: 'Hash is required' });
    }

    const token = await Token.findOne({ hash, owner: userId });

    if (!token) {
      return res.status(404).json({ message: 'Hash not found' });
    }

    if (token.used) {
      return res.status(400).json({ message: 'Hash already used' });
    }

    const decrypted = decrypt(encrypted, token.shift);

    token.used = true;
    await token.save();

    res.json({ decrypted });
  } catch (error) {
    console.error('Decrypt error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  encryptMessage,
  decryptMessage,
};


