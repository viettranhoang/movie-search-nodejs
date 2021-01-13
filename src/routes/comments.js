const express = require('express');
const router = express.Router();

const commentController = require('../controllers/CommentController');


router.post('/store', commentController.store);

module.exports = router;
