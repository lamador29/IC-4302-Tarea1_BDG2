const express = require('express');
const path = require('path');
const app = express();
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const commentRoutes = require('./routes/commentRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

//Funciones para repositorio:------------------------------------------------
const {createRepository, search, RepositoriesOfAnUser, addFileToRepositoryFolder, 
       downloadFiles, makeCommit, makeComment, getCommentsFromRepository, fork} = require('./controllers/RepositoryController.cjs');
//¿Comó usar estas cosas? Como simples funciones.
//createRepository(param1, param2...); Estan documentados dentro de RepositoryController.cjs en controllers.
//----------------------------------------------------------------------------
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/recommendationRoutes', recommendationRoutes);
//app.use('/repos', repoRoutes); 
app.use('/api', commentRoutes); 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});