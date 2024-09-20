const Neo4j = require('neo4j-driver');
const neo4jClient = require('../db/neo4j');


const session = neo4jClient.session();

exports.loginUser = async (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { username } = req.body;

  try{
    const result = await session.run(
      'MATCH (u:User {username: $username}) RETURN u',
      { username });


    if (result.records.length > 0) {
      const userNode = result.records[0].get('u');
      console.log('Usuario encontrado:', userNode);
      res.send('Inicio de sesión exitoso');

    } else {
      console.log('Usuario no encontrado');
      res.status(404).send('Usuario no encontrado');
    }

  } catch (error) {
    console.error('Error al buscar en Neo4j: ', error);
    res.status(500).send('Error al consultar la base de datos');    
  }
};