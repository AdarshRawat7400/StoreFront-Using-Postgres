import bcrypt from 'bcrypt';
import db from './models.mjs'
import { randomInt } from 'crypto';


// Hash a password for storage
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Compare a plain text password with its hashed version
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
const generateItemUniqueItemId = async () => {
  let uniqueId;
  let existingItem = null;
  do {
    uniqueId = crypto.randomUUID()
    existingItem = await db.cart.findOne({ "order_id": uniqueId });
  } while (existingItem);

  return uniqueId;
};
const generateProductUniqueItemId = async () => {
  let uniqueId;
  let existingItem = null;
  do {
    uniqueId = randomInt(10000000000);
    existingItem = await db.products.findOne({ "product_id": uniqueId });
  } while (existingItem);

  return uniqueId;
};

export {hashPassword,comparePassword,generateItemUniqueItemId,generateProductUniqueItemId};