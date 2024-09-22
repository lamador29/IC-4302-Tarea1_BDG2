const neo4jClient = require('../db/neo4j');


exports.like = async (req, res) => {
  const { repositoryName, username } = req.body;

  console.log('Usuario recibido:', username);
  console.log('Repositorio recibido:', repositoryName);

  let session;
    try {
      session = neo4jClient.session();

      //Register relationship
      const query = `
        MATCH (u:User {username: $username}), (r:Repository {repositoryName: $repositoryName})
        CREATE (u)-[:LIKE]->(r)
        RETURN r, u
      `;
      const queryParameters = { repositoryName, username };
      const result2 = await session.run(query, queryParameters);

      console.log('Relacion creada en Neo4j:', result2.records);
      res.status(201).send('Relacion creada en Neo4j:');

    } catch (error) {
      console.error('Error al registrar la relacion en Neo4j: ', error);
      res.status(500).send('Error al registrar la relacion en Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
};





exports.dislike = async (req, res) => {
  const { repositoryName, username } = req.body;

  console.log('Usuario recibido:', username);
  console.log('Repositorio recibido:', repositoryName);

  let session;
    try {
      session = neo4jClient.session();

      //Register relationship
      const query = `
        MATCH (u:User {username: $username}), (r:Repository {repositoryName: $repositoryName})
        CREATE (u)-[:DISLIKE]->(r)
        RETURN r, u
      `;
      const queryParameters = { repositoryName, username };
      const result2 = await session.run(query, queryParameters);

      console.log('Relacion creada en Neo4j:', result2.records);
      res.status(201).send('Relacion creada en Neo4j:');

    } catch (error) {
      console.error('Error al registrar la relacion en Neo4j: ', error);
      res.status(500).send('Error al registrar la relacion en Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
};





exports.subscribe = async (req, res) => {
  const { repositoryName, username } = req.body;

  console.log('Usuario recibido:', username);
  console.log('Repositorio recibido:', repositoryName);

  let session;
    try {
      session = neo4jClient.session();

      //Register relationship
      const query = `
        MATCH (u:User {username: $username}), (r:Repository {repositoryName: $repositoryName})
        CREATE (u)-[:SUBSCRIBE]->(r)
        RETURN r, u
      `;
      const queryParameters = { repositoryName, username };
      const result2 = await session.run(query, queryParameters);

      console.log('Relacion creada en Neo4j:', result2.records);
      res.status(201).send('Relacion creada en Neo4j:');

    } catch (error) {
      console.error('Error al registrar la relacion en Neo4j: ', error);
      res.status(500).send('Error al registrar la relacion en Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
};