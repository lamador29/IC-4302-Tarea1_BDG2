const Aerospike = require('aerospike');
const bcrypt = require('bcrypt');
const client = require('../db/aerospike');
const { hashUsername } = require('../utils/cryptoUtils');

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('El nombre de usuario y la contraseña son requeridos');
  }

  const hashedUsername = hashUsername(username);

  console.log('Hashed username during login:', hashedUsername);

  const key = new Aerospike.Key('test', 'users', hashedUsername);

  client.get(key, (error, record) => {
    if (error) {
      console.error('Error al buscar en Aerospike:', error);
      return res.status(404).send('Usuario no encontrado');
    }

    const hashedPassword = record.bins.password;

    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        console.error('Error al comparar las contraseñas:', err);
        return res.status(500).send('Error al validar la contraseña');
      }

      if (result) {
        res.send('Inicio de sesión exitoso');
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    });
  });
};
