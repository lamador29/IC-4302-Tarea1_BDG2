const express = require('express');
const path = require('path');
const app = express();
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const commentRoutes = require('./routes/commentRoutes');
<<<<<<< Updated upstream
const recommendationRoutes = require('./routes/recommendationRoutes');

//Funciones para repositorio:
const {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, 
       pushFolderToCommits, makeComment, getCommentsFromRepository} = require('./controllers/RepositoryController.cjs');

//const repoRoutes = require('./routes/repoRoutes');
//const connectDB = require('./db/mongo');
//const Repository = require('./models/repository');
//connectDB(); 

=======

//Funciones para repositorio actuales:
const {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, pushFolderToCommits} = require('./controllers/RepositoryController.cjs');

>>>>>>> Stashed changes
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
<<<<<<< Updated upstream
app.use('/recommendationRoutes', recommendationRoutes);
//app.use('/repos', repoRoutes); 
=======
>>>>>>> Stashed changes
app.use('/api', commentRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});