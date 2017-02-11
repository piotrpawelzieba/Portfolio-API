const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: String,
    category: {
        type: String,
        lowercase: true
    },
    date: Date,
    isPublic: Boolean,
    url: String
});


const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;