const mongoose = require('mongoose');

//Conexion a MongoDB ATLAS
const uri = "mongodb+srv://lector:1234@tarea1.acsgw.mongodb.net/RPDB?retryWrites=true&w=majority&appName=Tarea1";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));
