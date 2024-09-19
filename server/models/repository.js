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
        type: [String],
        required : false
    },

    Files: {
        type : [String],
        required : false
    },
}, { timestamps: true });

const Repository = mongoose.model('Repository', repoSchema);
module.exports = Repository;
