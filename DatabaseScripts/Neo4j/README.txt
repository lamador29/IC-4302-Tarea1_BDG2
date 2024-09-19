###########################################
############       GUIDE       ############
###########################################

Before scripts:

Install neo4j from the oficial exe file

In the Neo4j desktop create a new Project
and ad

###########################################

1. Run databaseCreation.cql

Run the creation of users to allow for a
connection and backup admin user to be
created

In Neo4j use SHOW USERS to check the users
have been created with the set roles as
follows:

neo4jDatabaseBConnection
[editor] [reader] [PUBLIC]

administratorA
[admin] [PUBLIC]

###########################################


2. Run databaseStructure.cql

Run the code as an admin (or a role that
can create new relations so not the
connection one)

This creates the nodes:
u:User {id: 1, username: 'ExampleUser'}
r:Repository {id: 1, repositoryName: 'ExampleRepository'}

Which essentially defines two nodes and
their type, where they have a "name" and
an id which is a number

The rest defines relationships as LIKE,
DISLIKE, SUBCRIBE, OWNED between a user and
a repository like:

 User --[:LabelRelationship]-> Repository

###########################################


3. Make recomendations

### EASY - TODO

###########################################


4. Queries

To make queries you send the string querie
directly to the database connection


###########################################
############        END        ############
###########################################