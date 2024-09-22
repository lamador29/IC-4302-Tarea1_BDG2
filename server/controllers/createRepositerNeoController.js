const neo4jClient = require('../db/neo4j');


exports.createRepository = async (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { repoName, username } = req.body;

  console.log('Repositorio recibido:', repoName);
  
  let session;
    try {
      session = neo4jClient.session();

      //Register repository
      const result = await session.run(
          'CREATE (r:Repository { repositoryName: $repoName}) RETURN r',
          { repoName }
      );
      const node = result.records[0].get('r');
      console.log('Nodo repositorio creado en Neo4j:', node);

      //Register ownership
      const ownedQuery = `
        MATCH (u:User {username: $username})
        CREATE (r:Repository {repositoryName: $repoName})
        CREATE (u)-[:OWNED]->(r)
        RETURN r, u
      `;
      const ownedParameters = { repoName, username };
      const result2 = await session.run(ownedQuery, ownedParameters);
      console.log('Relacion creada Neo4j:', result2.records);



      
      res.status(201).send('Registro de repositorio en Neo4j exitoso');

    } catch (error) {
      console.error('Error al registrar repositorio en Neo4j: ', error);
      res.status(500).send('Error al registrar repositorio en Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
};