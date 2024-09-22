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
    const hash = await bcrypt.hash(password, saltRounds);

    const encryptedEmail = encrypt(email);
    const hashedUsername = hashUsername(username);

    const key = new Aerospike.Key('test', 'users', hashedUsername);
    const record = { username: hashedUsername, password: hash, email: encryptedEmail };

    await client.put(key,record);
    console.log('Registro guardado en Aerospike:', record);

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
