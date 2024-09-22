const express = require('express');
const router = express.Router();
const repositoryRecommendation = require('../controllers/repositoryRecommendation');

router.post('/', repositoryRecommendation.getRecommendations);

module.exports = router;