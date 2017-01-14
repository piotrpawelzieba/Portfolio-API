const path = require('path');
const express = require('express');
const indexVM = require('./viewModels');
const {getPhotos, getPhotoById, getPhotoByCategory, postPhoto, deletePhoto, uploadFile} = require('./controllers/photoController');


module.exports = function(app) {
    app.use('/Assets/uploads', express.static(__dirname + '/Assets/uploads'));
    app.get('/', indexVM);
    app.get('/api/photos', getPhotos);
    app.get('/api/photos/:id', getPhotoById);
    app.get('/api/photos/:category', getPhotoByCategory);
    app.delete('/api/photos/:id', deletePhoto);
    app.post('/api/photos', uploadFile, postPhoto);
}
