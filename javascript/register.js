import express from 'express';
import { urlencoded } from 'body-parser';
import Aerospike, { Key } from 'aerospike';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const app = express();
const saltRounds = 10;
const encryptionKey = 'clave-de-cifrado-segura-1234567890abcdef';
const algorithm = 'aes-256-ctr';

app.use(urlencoded({ extended: true }));

const config = {
  hosts: '127.0.0.1:3000'
};

const client = Aerospike.client(config);

client.connect((error) => {
  if (error) {
    console.error('Error al conectar a Aerospike:', error);
    process.exit(1);
  } else {
    console.log('Conectado a Aerospike exitosamente');
  }
});

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), Buffer.alloc(16, 0));  // IV de 16 bytes
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), Buffer.alloc(16, 0));  // IV de 16 bytes
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

app.post('/register', (req, res) => {
  const { email, password, username } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send('Error al encriptar la contraseña');
    }

    const encryptedEmail = encrypt(email);
    const encryptedUsername = encrypt(username);

    const key = new Key('test', 'users', encryptedEmail);
    const record = {
      username: encryptedUsername,
      password: hash
    };

    client.put(key, record, (error) => {
      if (error) {
        console.error('Error al guardar en Aerospike:', error);
        res.status(500).send('Error al guardar en la base de datos');
      } else {
        console.log('Registro guardado exitosamente:', record);
        res.send('Registro exitoso');
      }
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
