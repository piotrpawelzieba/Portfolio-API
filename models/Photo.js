const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: String,
    category: String,
    date: Date,
    isPublic: Boolean,
    url: String
});

const Photo = mongoose.model("Photo", PhotoSchema);

const tempPhoto = new Photo({
    title: 'Title',
    category: 'Weddings',
    date: new Date(),
    isPublic: true,
    url: 'http://example.com/super.jpg'
});

tempPhoto.save();

module.exports = Photo;