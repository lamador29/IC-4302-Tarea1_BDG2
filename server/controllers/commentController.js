const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
  const { repositoryId, username, content } = req.body;

  try {
    const comment = new Comment({
      repositoryId,
      username,
      content,
      createdAt: new Date() // Ensure createdAt field is populated
    });
    await comment.save(); // Save comment to MongoDB
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Error adding comment' });
  }
};


exports.getComments = async (req, res) => {
  const { repositoryId } = req.params; // Get repository ID from the route parameter

  try {
    const comments = await Comment.find({ repositoryId }).sort({ createdAt: -1 }); // Retrieve comments, sorted by date
    res.status(200).json(comments);
  } catch (err) {
    console.error('Error retrieving comments:', err);
    res.status(500).json({ error: 'Error retrieving comments' });
  }
};

