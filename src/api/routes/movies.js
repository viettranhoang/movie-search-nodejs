const express = require('express');
const router = express.Router();

const movieController = require('../../controllers/MovieController');


router.get('/', movieController.infoTemp);
router.get('/crawl', movieController.crawl);
router.get('/search', movieController.search);
router.get('/trending', movieController.trending);


module.exports = router;
