
const mongoose = require('mongoose');

//Modelos
const Repository = require('./repository.js')

//Conexion a MongoDB ATLAS
const uri = "mongodb+srv://lector:1234@tarea1.acsgw.mongodb.net/RPDB?retryWrites=true&w=majority&appName=Tarea1";
mongoose.connect(uri);


//Crear repositorio: lo manda a la BD y retorna el repositorio
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

//Regrese todos los repositorios de un usuario
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

//Para busquedas
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

        console.log('Archivo agregado al folder:', updatedRepository);
        return updatedRepository;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

//Para cuando se hace un commit, mandar el directorio entero al historial de comits
async function pushFolderToCommits(repositoryId) {
    try {
        const repository = await Repository.findById(repositoryId);
        if (!repository) {
            throw new Error('Repository not found');
        }
        repository.comits.push(repository.folder);
        const updatedRepository = await repository.save();
        console.log('Operacion hecha con exito con el archivo:', updatedRepository);
        return updatedRepository;
    } catch (error) {
            console.error('Error:', error);
            throw error;
    }
}

module.exports = {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, pushFolderToCommits};