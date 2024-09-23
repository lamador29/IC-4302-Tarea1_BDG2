const express = require('express');
const router = express.Router();
const relationshipNeo = require('../controllers/relationshipNeo');

router.post('/like', relationshipNeo.like)
router.post('/dislike', relationshipNeo.dislike);
router.post('/subscribe', relationshipNeo.subscribe);

router.post('/deleteLike', relationshipNeo.deleteLike);
router.post('/deleteDislike', relationshipNeo.deleteDislike);
router.post('/deleteSubscribe', relationshipNeo.deleteSubscribe);

module.exports = router;