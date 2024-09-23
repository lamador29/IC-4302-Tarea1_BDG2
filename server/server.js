const express = require('express');
const path = require('path');
const app = express();
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const commentRoutes = require('./routes/commentRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const createRepositerNeo = require('./routes/createRepositerNeoRoutes');
const relationshipNeoRoutes = require('./routes/relationshipNeoRoutes');
const repositoryFunctionsRoutes = require('./routes/repositoryRoutes');
const repoRoutes = require('./routes/repoRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/recommendationRoutes', recommendationRoutes);
app.use('/createRepositerNeo', createRepositerNeo);
app.use('/relationship', relationshipNeoRoutes);
app.use('/repos', repoRoutes); 
app.use('/', commentRoutes);

app.use('/repositoryFunction', repositoryFunctionsRoutes);



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});