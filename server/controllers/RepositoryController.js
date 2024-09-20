const mongoose = require('mongoose');

//Acceder a models bien tedioso
const path = require('path');
const re = '/path/to/current/directory';
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
async function createRepository(title, isPublic, user) {
    try {
        const newRepository = new repository({
            title: title,
            isPublic: isPublic,
            users: [user]
        });
        // Save the new document to the database
        const savedRepository = await newRepository.save();
        console.log('New repository created:', savedRepository);
        return savedRepository;
    } catch (error) {
        console.error('Error creating repository:', error);
        throw error;
    }
}

export{ createRepository};
