// const express = require('express');
// const router = express.Router();
const commentRouter = require('./routes/comments');
const movieRouter = require('./routes/movies');

function route(app) {
    app.use('/comments', commentRouter);
    app.use('/movies', movieRouter);


}

module.exports = route;
