import bcrypt from 'bcrypt';
import db from './models.mjs'
import { randomInt } from 'crypto';
import os from 'os';


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


const getServerIP = () => {
  const ifaces = os.networkInterfaces();
  let serverIP = 'localhost'; // Default to localhost if no IP is found

  Object.keys(ifaces).forEach((ifname) => {
    ifaces[ifname].forEach((iface) => {
      if ('IPv4' === iface.family && !iface.internal) {
        serverIP = iface.address;
      }
    });
  });

  return serverIP;
};

export {hashPassword,comparePassword,generateItemUniqueItemId,generateProductUniqueItemId,getServerIP};