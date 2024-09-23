const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comments', commentController.addComment);

router.get('/comments/:repositoryId', commentController.getCommentsPage);

module.exports = router;
