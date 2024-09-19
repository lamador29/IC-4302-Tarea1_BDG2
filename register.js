console.log("El archivo se está ejecutando");

const express = require('express');
const { urlencoded } = require('body-parser');
const Aerospike = require('aerospike');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');

const app = express();
const saltRounds = 10;
const encryptionKey = crypto.createHash('sha256').update('clave-de-cifrado-segura').digest();
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html')); 
});

function encrypt(text) {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv); 
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; 
}

function decrypt(text) {
  const [ivHex, encryptedText] = text.split(':'); 
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv); 
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

app.post('/register', (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { email, password, username } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send('Error al encriptar la contraseña');
    }

    const encryptedEmail = encrypt(email);
    const encryptedUsername = encrypt(username);

    const key = new Aerospike.Key('test', 'users', encryptedEmail);
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

try {
  app.listen(3003, () => {
    console.log('Servidor escuchando en el puerto 3003');
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error);
}
