const express = require('express');
const path = require('path');
const app = express();
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');

//Funciones para repositorio actuales:
const {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, pushFolderToCommits} = require('./controllers/RepositoryController.cjs');

//const repoRoutes = require('./routes/repoRoutes');
//const connectDB = require('./db/mongo'); Aw hell naw -Wes
//const Repository = require('./models/repository');
//connectDB(); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
//app.use('/repos', repoRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Ejemplo de una ruta para interactuar con el modelo de MongoDB (repositorios)
/* app.post('/create-repository', async (req, res) => {
  const { Title, IsPublic, commits, Files } = req.body;

  try {
    // Creando un nuevo repositorio en MongoDB
    const newRepo = new Repository({
      Title,
      IsPublic,
      commits: commits || [], // Si no se proporcionan commits, ponemos un array vacío
      Files: Files || [] // Si no se proporcionan archivos, ponemos un array vacío
    });

    // Guardando el repositorio en MongoDB
    const savedRepo = await newRepo.save();
    res.status(201).json({ message: 'Repositorio creado exitosamente', data: savedRepo });
  } catch (err) {
    console.error('Error al crear el repositorio:', err);
    res.status(500).json({ error: 'Error al crear el repositorio' });
  }
}); */

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

