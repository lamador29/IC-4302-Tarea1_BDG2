"""
Read README file to make this test work
Do step 1 to configure database
Do step 2 to configure the connection
user or modify the variables below

Install the python driver for neo4j from pip
"""

from neo4j import GraphDatabase

uri = "bolt://localhost:7687"
username = "neo4jDatabaseBConnection"
password = "a1a2a3a4a5"




driver = GraphDatabase.driver(uri, auth=(username, password))

def run_query(query):
    with driver.session() as session:
        result = session.run(query)
        records = [record for record in result]
        return records




query = "CREATE (u:User {id: 2, username: 'InsertionPython'})"
query = """MATCH (u:User {id: 2}), (r:Repository {id: 1})
CREATE (u)-[:LIKE]->(r);"""

query = "MATCH (n) RETURN n"




try:
    result = run_query(query)

    for record in result:
        print(record)


        
except Exception as e:
    print(e)
finally:
    driver.close()





