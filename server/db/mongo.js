const mongoose = require('mongoose');

const dbURI = "mongodb+srv://netninja:test1234@net-ninja-tuts-del96.mongodb.net/node-tuts";

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB exitosamente');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err);
  }
};

module.exports = connectDB;