const fs = require('fs');
const { Client } = require("cassandra-driver");
const { v4: uuidv4 } = require('uuid'); 

async function MakeTable(){
    try{
        const client = new Client({
            cloud: {
            secureConnectBundle: '..models/secure-connect-archivero1.zip',
            },
            credentials: {
            username: "BaWbQjpNyioupBYIgdOccHBo",
            password: "CoyZZG9sHuZ9W76QyI,DyAIghMik1KsDkRb0DwYh1JjEsb_BaJYF3,,8ef27+pmc,OkZy3Z0l5C59+1,dZ3djnmRxcNsWGtUJZtfDFg6m8Z3IkuJwLyRhONhtPkmnKjO",
            },
            keyspace: "archivos"
          });
        
        await client.connect();
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS storage (
                id UUID PRIMARY KEY,
                file blob
            );
        `;
        client.execute(createTableQuery);
    }
    catch(err){
        console.error('Error:', err);
    }
}

//Parametro: el file
//Regresa: la llave para guardar en MongoDB
async function insertFile(filePath) {
    try {
        // Read the file into a buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Initialize the client and connect to Cassandra
        const client = new Client({
            cloud: { secureConnectBundle: '..models/secure-connect-archivero1.zip' },
            credentials: {
                username: "BaWbQjpNyioupBYIgdOccHBo",
                password: "CoyZZG9sHuZ9W76QyI,DyAIghMik1KsDkRb0DwYh1JjEsb_BaJYF3,,8ef27+pmc,OkZy3Z0l5C59+1,dZ3djnmRxcNsWGtUJZtfDFg6m8Z3IkuJwLyRhONhtPkmnKjO"
            },
            keyspace: "archivo"
        });
        await client.connect();

        // Generate a UUID for the file
        const id = uuidv4();

        // Prepare the CQL query for inserting the file
        const query = `
            INSERT INTO storage (id, file) VALUES (?, ?);
        `;
        // Execute the query with the file buffer
        await client.execute(query, [id, fileBuffer], { prepare: true });
        
        console.log(`File inserted with id: ${id}`);

        // Shutdown the client after the operation
        await client.shutdown();

        // Return the ID of the inserted file
        return id;
    } catch (err) {
        console.error('Error inserting file:', err);
        throw err;
    }
}

//Parametros por ejemplo = ['uuid1', 'uuid2', 'uuid3'];
//Te regresa los archivos, sean lo que sean.
async function getFilesByIds(idList) {
    try {
        const client = new Client({
            cloud: { secureConnectBundle: '..models/secure-connect-archivero1.zip' },
            credentials: {
                username: "BaWbQjpNyioupBYIgdOccHBo",
                password: "CoyZZG9sHuZ9W76QyI,DyAIghMik1KsDkRb0DwYh1JjEsb_BaJYF3,,8ef27+pmc,OkZy3Z0l5C59+1,dZ3djnmRxcNsWGtUJZtfDFg6m8Z3IkuJwLyRhONhtPkmnKjO"
            },
            keyspace: "archivo"
        });
        // Convert idList into a format suitable for the CQL `IN` clause
        const placeholders = idList.map(() => '?').join(',');
        // CQL query to fetch records where id is in the provided list
        const query = `
            SELECT id, file FROM storage WHERE id IN (${placeholders});
        `;
        const result = await client.execute(query, idList, { prepare: true });

        // Process and return the results
        const files = result.rows.map(row => ({
            id: row.id,
            file: row.file
        }));

        console.log(`Retrieved ${files.length} files`);
        await client.shutdown();
        return files;

    } catch (err) {
        console.error('Error retrieving files:', err);
        throw err;
    }
}

module.exports = { insertFile, getFilesByIds}