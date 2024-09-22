//Cosas:
const mongoose = require('mongoose');
const { insertFile, getFilesByIds } = require('./casandraController.cjs');
const pth = require('path');
const archiver = require('archiver');

//Modelos
const Repository = require('./repository.js')

//Conexion a MongoDB ATLAS
const uri = "mongodb+srv://lector:1234@tarea1.acsgw.mongodb.net/RPDB?retryWrites=true&w=majority&appName=Tarea1";
mongoose.connect(uri);

/*
Crear repositorio: lo manda a la BD y retorna el repositorio
Title: String, isPublic: Booleano (1 y 0), userString: String, tagsString String("tag, tag2, tag 3 separados por comas")
*/
async function createRepository(title, isPublic, userString, tagsString) {
    try {
        const users = [userString];
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
        const newRepository = new Repository({
            title: title,
            isPublic: isPublic,
            users: users,
            tags: tags      
        });
        const savedRepository = await newRepository.save();
        console.log('Nuevo repositorio:', savedRepository);
        return savedRepository;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

/*Regrese todos los repositorios de un usuario
Parametro: El nombre de usuario actual
*/
async function RepositoriesOfAnUser(user) {
    try {
        // Find repositories where the user is in the users array
        const repositories = await Repository.find({ users: user });

        console.log(`Repositorios del usuario ${user}:`, repositories);
        return repositories;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


/*Search: Para busquedas
Parametro: lo que sea que el usuario escriba (un string)
*/
async function search(titleStart) {
    try {
        const repositories = await Repository.find({
            title: { $regex: `^${titleStart}`, $options: 'i' }, 
            isPublic: true  
        });
        console.log(`Resultados"${titleStart}":`, repositories);
        return repositories;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

//Funcion auxiliar para que tecnicamente se actualicen los archivos.
async function removeFileIfExists(repositoryId, fileTitle) {
    try {
        // Find the repository by its ID
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        // Check if the file with the specified title exists in the folder
        const fileIndex = repository.folder.files.findIndex(file => file.title === fileTitle);
        // If the file is found, remove it
        if (fileIndex !== -1) {
            repository.folder.files.splice(fileIndex, 1); // Remove the file from the array
            await repository.save(); // Save the updated repository
            console.log(`File '${fileTitle}' removed from repository.`);
            return true; // Return true indicating the file was found and removed
        } else {
            console.log(`File '${fileTitle}' not found in the repository.`);
            return false; // Return false if the file was not found
        }
    } catch (error) {
        console.error('Error checking and removing file:', error);
        throw error;
    }
}

/*Agregar un archivo a un repositorio
Parametros: Id del repositorio al que se le quiere subir el archivo, filepath la direccion del archivo que quiere subirse*/
async function addFileToRepositoryFolder(repositoryId, filePath) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        const Path = insertFile(repositoryId, filePath);
        const fileTitle = pth.basename(filePath);
        removeFileIfExists(fileTitle);

        const newFile = {
            title: fileTitle,
            path: Path,
        };
        repository.folder.files.push(newFile);
        const updatedRepository = await repository.save();
        console.log('File added to repository folder:', updatedRepository);
        return updatedRepository;
    } catch (error) {
        console.error('Error adding file to repository folder:', error);
        throw error;
    }
}

//Para cuando se hace un commit ocupan llamar esto, mandar el directorio entero al historial de comits
async function makeCommit(repositoryId) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        repository.comits.push(repository.folder);
        const updatedRepository = await repository.save();
        console.log('Folder pushed to comits:', updatedRepository);
        return updatedRepository;
    } catch (error) {
            console.error('Error:', error);
            throw error;
    }
}

// Funcion para insertar un comentario en un repositorio
// Ocupa como parametro el repositorio, el nombre de usuario y el texto del comentario.
async function makeComment(repositoryId, username, commentText) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        const newComment = {
            username: username,
            text: commentText
        };
        repository.comments.push(newComment);
        const updatedRepository = await repository.save();
        console.log('Comment added to repository:', updatedRepository);
        return updatedRepository;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

//Leer todos los comentarios de un repositorio, para mostrarlo en pantalla
async function getCommentsFromRepository(repositoryId) {
    try {
        const repository = await Repository.findById(repositoryId).select('comments');
        if (!repository) {
            throw new Error('Repository not found');
        }
        console.log('Commentarios', repository.comments);
        return repository.comments;

    } catch (error) {
        console.error('Error retrieving comments:', error);
        throw error;
    }
}

//Para descargar los archivos y dejarlos en zipFilePath como un archivo de tipo zip.
async function downloadFiles(repositoryId, zipFilePath) {
    try {
        const repository = await Repository.findById(repositoryId).exec();
        if (!repository) {
            throw new Error('Repository not found');
        }

        // Get the file paths from the repository's folder
        const filePaths = repository.folder.files.map(file => file.path);
        const files = await getFilesByIds(filePaths); 

        // Create a write stream for the zip file
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add each file buffer to the zip archive
        files.forEach((file, index) => {
            const originalFilePath = filePaths[index];
            const fileName = originalFilePath.split('/').pop(); // Extract file name from path
            archive.append(file, { name: fileName });
        });

        // Finalize the archive (no more files will be added)
        await archive.finalize();

        console.log(`Files compressed into: ${zipFilePath}`);
        return zipFilePath;
    } catch (error) {
        console.error('Error retrieving and zipping files:', error);
        throw error;
    }
}

//Una version perezosa de fork.
//Ocupa el repositorio que se quiere forkear y el usuario al que le pertenecera el fork
async function fork(repositoryId, userId) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        // Step 2: Create a new repository with only selected fields
        const newRepository = new Repository({
            title: repository.title,       // Copy the title
            tags: repository.tags,         // Copy the tags
            folder: repository.folder,     // Copy the folder
            users: [userId],               // Insert userId into the users array
            isPublic: repository.isPublic 
        });
        // Step 3: Save the new repository to the database
        const savedRepository = await newRepository.save();
        return savedRepository;
    } catch (error) {
        console.error('Error forking the repository:', error);
        throw error;
    }
}

module.exports = {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, 
                  downloadFiles, makeCommit, makeComment, getCommentsFromRepository, fork};