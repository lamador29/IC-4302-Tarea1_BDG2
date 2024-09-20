
const express = require('express');
const router = express.Router();
const loginNeoController = require('../controllers/loginNeoController');

router.post('/', loginNeoController.loginUser);

module.exports = router;