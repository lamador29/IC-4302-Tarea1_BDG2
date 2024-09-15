const express = require('express');
const bodyParser = require('body-parser');
const Aerospike = require('aerospike');

const app = express();

// Configurar body-parser para manejar formularios POST
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para servir el formulario HTML de registro
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Asegúrate de que el archivo HTML esté en la misma carpeta
});

// Configurar Aerospike
const config = {
  hosts: '127.0.0.1:3000' // Cambia la IP si es necesario
};
const client = Aerospike.client(config);
client.connect((error) => {
  if (error) {
    console.error('Error al conectar a Aerospike:', error);
    process.exit(1);
  }
});

// Ruta para manejar el formulario POST del registro
app.post('/register', (req, res) => {
  const { email, password, nombre } = req.body; // Los nombres de los campos deben coincidir con el HTML

  const key = new Aerospike.Key('test', 'users', email); // Usar el email como clave

  const record = {
    nombre: nombre,
    password: password
  };

  client.put(key, record, (error) => {
    if (error) {
      console.error('Error al guardar en Aerospike:', error);
      res.status(500).send('Error al guardar en la base de datos');
    } else {
      console.log('Registro guardado exitosamente:', record);
      res.send('Registro exitoso');
    }
  });
});

// Servidor corriendo en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

