// Cifra de César
const caesarEncrypt = (text, shift) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const alphabetLength = alphabet.length;
  const normalizedShift = ((shift % alphabetLength) + alphabetLength) % alphabetLength;

  return text
    .toLowerCase()
    .split('')
    .map((char) => {
      const index = alphabet.indexOf(char);
      if (index === -1) return char;
      const newIndex = (index + normalizedShift) % alphabetLength;
      return alphabet[newIndex];
    })
    .join('');
};

const caesarDecrypt = (text, shift) => {
  return caesarEncrypt(text, -shift);
};

// ROT13 - Rotação de 13 posições (padrão para letras)
const rot13Encrypt = (text) => {
  return text
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        const base = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - base + 13) % 26) + base);
      }
      return char;
    })
    .join('');
};

const rot13Decrypt = (text) => {
  // ROT13 é simétrico - aplicar duas vezes retorna ao original
  return rot13Encrypt(text);
};

// Base64 - Encoding padrão
const base64Encrypt = (text) => {
  return Buffer.from(text, 'utf-8').toString('base64');
};

const base64Decrypt = (text) => {
  try {
    return Buffer.from(text, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error('Invalid Base64 string');
  }
};

// Atbash - Inversão do alfabeto (A->Z, B->Y, etc)
const atbashEncrypt = (text) => {
  return text
    .toLowerCase()
    .split('')
    .map((char) => {
      if (char.match(/[a-z]/)) {
        // a=0, z=25 -> a vira z (25-0), b vira y (25-1), etc
        const charCode = char.charCodeAt(0);
        const reversed = 122 - (charCode - 97); // 122 é 'z', 97 é 'a'
        return String.fromCharCode(reversed);
      } else if (char.match(/[0-9]/)) {
        // Inverte números também (0->9, 1->8, etc)
        return String(9 - parseInt(char));
      }
      return char;
    })
    .join('');
};

const atbashDecrypt = (text) => {
  // Atbash é simétrico - aplicar duas vezes retorna ao original
  return atbashEncrypt(text);
};

// Mapa de métodos disponíveis
const methods = {
  caesar: {
    encrypt: caesarEncrypt,
    decrypt: caesarDecrypt,
    requiresShift: true,
    name: 'Cifra de César',
    description: 'Deslocamento de caracteres por posições'
  },
  rot13: {
    encrypt: rot13Encrypt,
    decrypt: rot13Decrypt,
    requiresShift: false,
    name: 'ROT13',
    description: 'Rotação fixa de 13 posições'
  },
  base64: {
    encrypt: base64Encrypt,
    decrypt: base64Decrypt,
    requiresShift: false,
    name: 'Base64',
    description: 'Codificação Base64 padrão'
  },
  atbash: {
    encrypt: atbashEncrypt,
    decrypt: atbashDecrypt,
    requiresShift: false,
    name: 'Atbash',
    description: 'Inversão do alfabeto'
  }
};

const encrypt = (text, method = 'caesar', shift = 3) => {
  const cipherMethod = methods[method];
  if (!cipherMethod) {
    throw new Error(`Unknown method: ${method}`);
  }

  if (cipherMethod.requiresShift) {
    return cipherMethod.encrypt(text, shift);
  }
  return cipherMethod.encrypt(text);
};

const decrypt = (text, method = 'caesar', shift = 3) => {
  const cipherMethod = methods[method];
  if (!cipherMethod) {
    throw new Error(`Unknown method: ${method}`);
  }

  if (cipherMethod.requiresShift) {
    return cipherMethod.decrypt(text, shift);
  }
  return cipherMethod.decrypt(text);
};

const getAvailableMethods = () => {
  return Object.keys(methods).map(key => ({
    id: key,
    name: methods[key].name,
    description: methods[key].description,
    requiresShift: methods[key].requiresShift
  }));
};

module.exports = {
  encrypt,
  decrypt,
  getAvailableMethods,
  methods
};

