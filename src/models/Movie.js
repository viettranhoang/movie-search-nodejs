const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movie = new Schema(
    {
        name: { type: String },
        globalName: { type: String },
        movieLink: { type: String, unique: true },
        poster: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Movie', Movie);
