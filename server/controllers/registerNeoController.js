const Neo4j = require('neo4j-driver');
const neo4jClient = require('../db/neo4j');


const session = neo4jClient.session();


exports.registerUser = async (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { username } = req.body;

  try{
    const result = await session.run(
      'CREATE (u:User {username: $username}) RETURN u',
      { username });

    const userNode = result.records[0].get('u');
    console.log('Nodo usuario creado:', userNode);

    res.send('Registro exitoso');
  } catch (error) {

    console.error('Error al guardar en neo: ', error);
    res.status(500).send('Error al guardar en la base de datos');    
  }
};
