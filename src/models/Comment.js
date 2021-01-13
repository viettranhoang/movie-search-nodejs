
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
    {
        authorId: { type: String, required: true },
        authorName: { type: String },
        authorThumb: { type: String },
        authorUri: { type: String },
        content: { type: String, required: true },
        timestamp: { type: Number },
        filmId: { type: String, required: true }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Comment', Comment);
