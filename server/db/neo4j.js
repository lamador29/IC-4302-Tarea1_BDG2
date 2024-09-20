const neo4j = require('neo4j-driver');

const config = {
  uri: 'bolt://localhost:7687',
  user: 'neo4jDatabaseBConnection',
  password: 'a1a2a3a4a5'
};

const neo4jClient = neo4j.driver(config.uri, neo4j.auth.basic(config.user, config.password));


async function checkConnection(){

  try {
    await neo4jClient.verifyConnectivity();
    console.log('Conectado a Neo4j exitosamente');
  } catch (error) {
    console.error('Error al conectar a Neo4j:', error);
    process.exit(1);
  }
}

checkConnection();

module.exports = neo4jClient;
