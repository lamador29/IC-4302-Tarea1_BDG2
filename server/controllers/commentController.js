const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
  const { repositoryId, username, content } = req.body;

  try {
    const comment = new Comment({
      repositoryId,
      username,
      content,
      createdAt: new Date()
    });
    await comment.save();

    res.redirect(`/comments/${repositoryId}`);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).send('Error adding comment');
  }
};

exports.getCommentsPage = async (req, res) => {
  const { repositoryId } = req.params;

  try {
    const comments = await Comment.find({ repositoryId }).sort({ createdAt: -1 });
    res.render('comments', { repositoryId, comments });
  } catch (err) {
    console.error('Error retrieving comments:', err);
    res.status(500).send('Error retrieving comments');
  }
};

