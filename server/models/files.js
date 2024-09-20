const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const filesSchema = new Schema({
    files : [{
        title: String,
        date: { type: Date, default: Date.now },
        path: String
    }]
})

const files = mongoose.model('files', filesSchema);
module.exports = files;