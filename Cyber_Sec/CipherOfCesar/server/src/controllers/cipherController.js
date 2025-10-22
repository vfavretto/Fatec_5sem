const crypto = require('crypto');
const Token = require('../models/Token');
const { encrypt, decrypt, getAvailableMethods } = require('../utils/cipherMethods');

const generateHash = (message, method, shift, userId) => {
  const hash = crypto
    .createHash('sha256')
    .update(`${userId}:${method}:${shift}:${message}:${Date.now()}`)
    .digest('hex');

  return hash;
};

const encryptMessage = async (req, res) => {
  try {
    const { message, shift, method = 'caesar' } = req.body;
    const userId = req.user.id;

    if (typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const validMethods = ['caesar', 'rot13', 'base64', 'atbash'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ message: 'Invalid encryption method' });
    }

    if (method === 'caesar' && !Number.isInteger(shift)) {
      return res.status(400).json({ message: 'Shift must be an integer for Caesar cipher' });
    }

    const encrypted = encrypt(message, method, shift || 3);
    const hash = generateHash(message, method, shift || 0, userId);

    await Token.create({ 
      hash, 
      method,
      shift: method === 'caesar' ? shift : undefined, 
      owner: userId, 
      used: false 
    });

    res.json({ encrypted, hash, method });
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

    const decrypted = decrypt(encrypted, token.method, token.shift || 3);

    token.used = true;
    await token.save();

    res.json({ decrypted, method: token.method });
  } catch (error) {
    console.error('Decrypt error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const listMethods = async (req, res) => {
  try {
    const methods = getAvailableMethods();
    res.json({ methods });
  } catch (error) {
    console.error('List methods error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  encryptMessage,
  decryptMessage,
  listMethods,
};


