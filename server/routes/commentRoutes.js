const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/api/comments', commentController.addComment);

router.get('/api/comments/:repositoryId', commentController.getComments);

module.exports = router;
