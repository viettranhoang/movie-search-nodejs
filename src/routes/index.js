// const commentRouter = require('./comments');
const movieRouter = require('./movies');

function route(app) {
    // app.use('/comments', commentRouter);
    app.use('/movies', movieRouter);


}

module.exports = route;
