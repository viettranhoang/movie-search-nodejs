const express = require('express');
const router = express.Router();

const movieController = require('../controllers/MovieController');


router.get('/:link', movieController.getInfo);

module.exports = router;
