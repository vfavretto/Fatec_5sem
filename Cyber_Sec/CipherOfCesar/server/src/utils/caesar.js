const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const alphabetLength = alphabet.length;

const normalizeShift = (shift) => {
  const normalized = shift % alphabetLength;
  return normalized < 0 ? normalized + alphabetLength : normalized;
};

const transform = (text, shift) => {
  const normalizedShift = normalizeShift(shift);

  return text
    .toLowerCase()
    .split('')
    .map((char) => {
      const index = alphabet.indexOf(char);
      if (index === -1) {
        return char;
      }
      const newIndex = (index + normalizedShift) % alphabetLength;
      return alphabet[newIndex];
    })
    .join('');
};

const encrypt = (text, shift) => transform(text, shift);
const decrypt = (text, shift) => transform(text, -shift);

module.exports = {
  encrypt,
  decrypt,
};


