const neo4jClient = require('../db/neo4j');


exports.getRecommendations = async (req, res) => {
    const { username } = req.body;
    console.log('Buscando repositorios recomendados para: ', username);
  
    if (!username) {
      return res.status(400).send('Se requiere un nombre de usuario para las recomendaciones');
    }
  
    let session;
    try {
      session = neo4jClient.session();
      const result = await session.run(`
        MATCH (target:User {username: $username})-[:LIKE|SUBSCRIBE|OWNED]->(r:Repository)<-[:LIKE|SUBSCRIBE]-(other:User)-[:LIKE|SUBSCRIBE]->(rec:Repository)
        WHERE NOT (target)-[:LIKE|SUBSCRIBE|OWNED]->(rec)
        RETURN rec, COUNT(*) AS score
        ORDER BY score DESC
        LIMIT 5`,
        { username }
      );

      //console.log('Datos obtenidos: ', result);
  
      if (result.records.length === 0) {
        console.log('No hay repositorios recomendados');
        return res.json({ message: 'No se encontró ningún repositorio.' });
      }
  
      const repositories = result.records.map(record => record.get('rec').properties);
      console.log('Repositorios recomendados obtenidos: ', repositories);
      res.json(repositories);
    } catch (error) {
      console.error('Error al obtener recomendaciones de Neo4j: ', error);
      res.status(500).send('Error al obtener recomendaciones de Neo4j');
    } finally {
      if (session) {
        await session.close();
      }
    }
  };
