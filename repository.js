const mongoose = require('mongoose');
const Blog = require('./MongoThings/blog');

const app = express();

//Here starts the weird stuff
const dbURI = "mongodb+srv://netninja:test1234@net-ninja-tuts-del96.mongodb.net/node-tuts";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

