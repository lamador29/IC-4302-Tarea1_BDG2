const mongoose = require('mongoose');

//Acceder a models
const path = require('path');
const re = 'server//controllers';
const parentDir = path.dirname(re);
const modelsDir = path.join(parentDir, 'models');


//Modelos
const repository = path.join(modelsDir, 'repository')


//Conexion a MongoDB ATLAS
const uri = "mongodb+srv://lector:1234@tarea1.acsgw.mongodb.net/RPDB?retryWrites=true&w=majority&appName=Tarea1";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));


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

export{ createRepository};
export{ RepositoriesOfAnUser};
export{ search}