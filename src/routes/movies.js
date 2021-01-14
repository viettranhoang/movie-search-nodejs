const express = require('express');
const router = express.Router();

const movieController = require('../controllers/MovieController');


router.get('/', movieController.getInfo);

module.exports = router;
