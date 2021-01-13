const Comment = require('../models/Comment');
const { mongooseToObject } = require('../../util/mongoose');

class CommentController {

    store(req, res, next) {
        
        const comment = new Comment(req.body);
        comment
            .save()
            .then(() => res.send(req.body))
            .catch(next);
    }

}

module.exports = new CourseController();
