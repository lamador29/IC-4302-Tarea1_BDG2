const express = require('express');
const router = express.Router();
const registerNeoController = require('../controllers/registerNeoController');

router.post('/', registerNeoController.registerUser);

module.exports = router;
