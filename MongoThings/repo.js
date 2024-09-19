const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const repoSchema = new Schema({
    Title : {
        type: String,
        required : true
    },

    IsPublic : {
        type: Boolean,
        required : true
    },

    commits: {
        type: array,
        required : false
    },

    Files: {
        type : array,
        required : false
    },
}, { timestamps: true });

const repository = mongoose.model('repository', repoSchema);
module.exports = repository;