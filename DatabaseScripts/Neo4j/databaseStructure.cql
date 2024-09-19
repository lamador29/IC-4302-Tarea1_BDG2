// Create nodes structure
CREATE (u:User {id: 1, username: 'ExampleUser'}),
       (r:Repository {id: 1, repositoryName: 'ExampleRepository'});


// Create LIKE Relationship
MATCH (u:User {id: 1}), (r:Repository {id: 1})
CREATE (u)-[:LIKE]->(r);

// Create DISLIKE Relationship
MATCH (u:User {id: 1}), (r:Repository {id: 1})
CREATE (u)-[:DISLIKE]->(r);

// Create SUBSCRIBE Relationship
MATCH (u:User {id: 1}), (r:Repository {id: 1})
CREATE (u)-[:SUBSCRIBE]->(r);

// Create OWNED Relationship
MATCH (u:User {id: 1}), (r:Repository {id: 1})
CREATE (u)-[:OWNED]->(r);