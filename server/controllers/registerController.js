const Aerospike = require('aerospike');
const bcrypt = require('bcrypt');
const client = require('../db/aerospike');
const { encrypt, hashUsername } = require('../utils/cryptoUtils');
const neo4jClient = require('../db/neo4j');
const saltRounds = 10;

exports.registerUser = async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { email, password, username } = req.body;

  try {
    const hashedUsername = hashUsername(username);
    const existingUserKey = new Aerospike.Key('test', 'users', hashedUsername);

    try {
      await client.get(existingUserKey);
      return res.status(409).send('El nombre de usuario ya existe'); // Conflict
    } catch (getError) {
      if (getError.code !== Aerospike.status.ERR_RECORD_NOT_FOUND) {
        // Handle other potential errors
        console.error('Error al verificar existencia del usuario:', getError);
        return res.status(500).send('Error al verificar el usuario');
      }
      // Proceed to register the user
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const encryptedEmail = encrypt(email);

    const newUserRecord = {
      username: hashedUsername,
      password: hash,
      email: encryptedEmail
    };

    await client.put(existingUserKey, newUserRecord);
    console.log('Registro guardado en Aerospike:', newUserRecord);

    const session = neo4jClient.session();
    const result = await session.run(
      'CREATE (u:User {username: $username}) RETURN u',
      { username }
    );
    const userNode = result.records[0].get('u');
    console.log('Nodo usuario creado en Neo4j:', userNode);
    await session.close();

    res.status(201).send('Registro exitoso');
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).send('Error al registrar el usuario');
  }
};
