const Aerospike = require('aerospike');
const bcrypt = require('bcrypt');
const client = require('../db/aerospike');
const { encrypt, hashUsername } = require('../utils/cryptoUtils');
const saltRounds = 10;

exports.registerUser = (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { email, password, username } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send('Error al encriptar la contraseña');
    }

    const encryptedEmail = encrypt(email);

    const hashedUsername = hashUsername(username);

    const key = new Aerospike.Key('test', 'users', hashedUsername);
    
    const record = { username: hashedUsername, password: hash, email: encryptedEmail };

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
};
