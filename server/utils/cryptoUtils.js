const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const encryptionKey = crypto.createHash('sha256').update('clave-de-cifrado-segura').digest();

function encrypt(text) {
  if (text == null) { 
    throw new Error('El texto a encriptar no puede ser nulo o indefinido');
  }
  const iv = Buffer.alloc(16, 0); 
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const iv = Buffer.alloc(16, 0); 
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function hashUsername(username) {
  return crypto.createHash('sha256').update(username).digest('hex');
}

module.exports = { encrypt, decrypt, hashUsername };

