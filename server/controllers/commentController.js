const Comment = require('../models/comment');

exports.addComment = async (req, res) => {
  const { repositoryId, username, content } = req.body;

  try {
    const comment = new Comment({
      repositoryId,
      username,
      content
    });
    await comment.save();
    res.status(201).json({ message: 'Comentario agregado exitosamente', comment });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el comentario' });
  }
};

exports.getComments = async (req, res) => {
  const { repositoryId } = req.params;

  try {
    const comments = await Comment.find({ repositoryId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
};
