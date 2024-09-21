
const mongoose = require('mongoose');

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

//Agregar un archivo a un repositorio
//Parametros:
//repositoryId:El id del repositorio al que se le agrega el archivo, fileTitle el titulo del archivo, filepath de eso me encargo yo.
async function addFileToRepositoryFolder(repositoryId, fileTitle, filePath) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        const newFile = {
            title: fileTitle,
            path: filePath
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

//Para cuando se hace un commit, mandar el directorio entero al historial de comits
// Su parametro es el repositorio.
async function pushFolderToCommits(repositoryId) {
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
// Ocupa el id del repositorio mostrado en pantalla, el nombre de usuario que hace el comentario, y lo que escribio en la caja texto
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

//Para mostrar todos los comentarios del repositorio.
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


module.exports = {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, 
                  pushFolderToCommits, makeComment, getCommentsFromRepository};