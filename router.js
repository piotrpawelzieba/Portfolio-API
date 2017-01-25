const path = require('path');
const express = require('express');
const indexVM = require('./viewModels');
const {getPhotos, getPhotoById, getPhotoByCategory, postPhoto, deletePhoto, uploadFile} = require('./controllers/photoController');
const {signup, signin} = require('./controllers/authenticationController');
const passportService = require('./services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});
const cors = require('cors');
options = {
     origin: 'http://localhost:3000',
}
module.exports = function(app) {
    app.use('/Assets/uploads', express.static(__dirname + '/Assets/uploads'));
    app.get('/', cors(options), indexVM);
    app.post('/api/signup', signup);
    app.post('/api/signin', requireSignin, signin);
    app.get('/api/photos', cors(options), getPhotos);
    app.get('/api/photos/:id', getPhotoById);
    app.get('/api/photos/:category', getPhotoByCategory);
    app.delete('/api/photos/:id', deletePhoto);
    app.post('/api/photos', uploadFile, postPhoto);
}
