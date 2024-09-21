const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  repositoryId: { type: String, required: true }, 
  username: { type: String, required: true },    
  content: { type: String, required: true },     
  createdAt: { type: Date, default: Date.now }   
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
