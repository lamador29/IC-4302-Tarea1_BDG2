const express = require('express');
const router = express.Router();
const createRepositerNeo = require('../controllers/createRepositerNeoController');

router.post('/', createRepositerNeo.createRepository);

module.exports = router;