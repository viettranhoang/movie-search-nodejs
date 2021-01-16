const express = require('express');
const router = express.Router();

const movieController = require('../controllers/MovieController');


router.get('/', movieController.info);
router.get('/crawl', movieController.crawl);


module.exports = router;
