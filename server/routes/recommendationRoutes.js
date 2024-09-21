const express = require('express');
const router = express.Router();
const repositoryRecommendation = require('../controllers/repositoryRecommendation');

router.get('/', repositoryRecommendation.getRecommendations);

module.exports = router;