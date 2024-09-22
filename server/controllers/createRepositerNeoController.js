const neo4jClient = require('../db/neo4j');


exports.createRepository = async (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { repositoryName } = req.body;

  console.log('Repositorio recibido:', repositoryName);
  
  let session;
    try {
      session = neo4jClient.session();
      const result = await session.run(
          'CREATE (r:Repository { repositoryName: $repositoryName}) RETURN r',
          { repositoryName }
      );
      const node = result.records[0].get('r');
      console.log('Nodo repositorio creado en Neo4j:', node);
      res.status(201).send('Registro repositorio en Neo4j exitoso');

    } catch (error) {
      console.error('Error al registrar repositorio en Neo4j: ', error);
      res.status(500).send('Error al obtener recomendaciones de Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
};