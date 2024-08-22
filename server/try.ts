import crypto from 'crypto';

function generateRandomHash(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const randomHash = generateRandomHash();
console.log('Generated Random Hash:', randomHash);