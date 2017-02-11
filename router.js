const path = require('path');
const express = require('express');
const indexVM = require('./viewModels');
const {getPhotos, getPhotoById, getPhotoByCategory, postPhoto, updatePhoto, deletePhoto, uploadFile} = require('./controllers/photoController');
const {postCategory, getCategories, updateCategory, removeCategory} = require('./controllers/categoryController');
const {signup, signin} = require('./controllers/authenticationController');
const passport = require('passport');
const passportService = require('./services/passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});
const cors = require('cors');
options = {
     "origin": "http://localhost:3000",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
}
module.exports = function(app) {
    app.options('*', cors()); // include before other routes;
    app.use('/Assets/uploads', express.static(__dirname + '/Assets/uploads'));
    app.get('/', cors(options), indexVM);
    app.post('/api/signup', signup);
    app.post('/api/signin', requireSignin, signin);
    app.get('/api/photos', cors(options), getPhotos);
    app.get('/api/photos/:id', getPhotoById);
    app.get('/api/photos/:category', getPhotoByCategory);
    app.put('/api/photos', updatePhoto)
    app.delete('/api/photos/:id', deletePhoto);
    app.post('/api/photos', uploadFile, postPhoto);
    app.get('/api/categories', cors(), getCategories);
    app.post('/api/categories', cors(options), postCategory);
    app.put('/api/categories', updateCategory);
    app.delete('/api/categories/:title', cors(options), removeCategory);
}
