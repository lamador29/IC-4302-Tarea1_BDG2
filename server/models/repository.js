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

const repositorySchema = new Schema({
    title: String,
    isPublic: boolean,
    rating: Number,
    users: [String],
    tags: [String],
    folder: filesSchema,
    comits: [filesSchema]
}, { timestamps: true });

const Repository = mongoose.model('repository', repositorySchema);
module.exports = Repository;
module.exports = files;