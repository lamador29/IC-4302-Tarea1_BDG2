const Aerospike = require('aerospike');

const config = {
  hosts: '127.0.0.1:3000'
};

const client = Aerospike.client(config);

client.connect((error) => {
  if (error) {
    console.error('Error al conectar a Aerospike:', error);
    process.exit(1);
  } else {
    console.log('Conectado a Aerospike exitosamente');
  }
});

module.exports = client;