import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  title: String,
  category: {
    type: String,
    lowercase: true,
  },
  date: Date,
  isPublic: Boolean,
  url: String,
});

const Photo = mongoose.model('Photo', PhotoSchema);

export default Photo;
