const commentRouter = require('./comments');
const movieRouter = require('./movies');

function route(app) {
    app.use('/comments', commentRouter);
    app.use('/movie', movieRouter);


}

module.exports = route;
