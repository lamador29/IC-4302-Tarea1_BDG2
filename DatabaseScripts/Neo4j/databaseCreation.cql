// Create Connection User
CREATE USER neo4jDatabaseBConnection SET PASSWORD 'a1a2a3a4a5' CHANGE NOT REQUIRED;
GRANT ROLE editor TO neo4jDatabaseBConnection ;
GRANT ROLE reader TO neo4jDatabaseBConnection ;

// Create Admin User
CREATE USER administratorA SET PASSWORD 'sj#1254js' CHANGE NOT REQUIRED;
GRANT ROLE admin TO administratorA;