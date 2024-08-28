// import crypto from 'crypto';

// function generateRandomHash(length = 64) {
//   return crypto.randomBytes(length).toString('hex');
// }

// const randomHash = generateRandomHash();
// console.log('Generated Random Hash:', randomHash);


const start = "19:00:00.123";
const end = "20:00:00.123";


const startDate = new Date(`2020-01-01T${start}`);
const endDate = new Date(`2020-01-01T${end}`);
console.log(startDate < endDate); // true