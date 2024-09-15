import express from 'express';
import { urlencoded } from 'body-parser';
import { client as _client, Key } from 'aerospike';

const app = express();

app.use(urlencoded({ extended: true }));

const config = {
  hosts: '127.0.0.1:3000' 
};
const client = _client(config);
client.connect((error) => {
  if (error) {
    console.error('Error al conectar a Aerospike:', error);
    process.exit(1);
  }
});


app.post('/register', (req, res) => {
  const { email, password, username } = req.body; 

  const key = new Key('test', 'users', email); 

  const record = {
    username: username,
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

