const path = require('path');
const indexVM = require('./viewModels');
const {getPhotos, getPhotoById, getPhotoByCategory, postPhoto, deletePhoto} = require('./controllers/photoController');

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.render(path.join(__dirname + '/views/pages/index'), indexVM);

    });
    app.get('/api/photos', getPhotos);
    app.get('/api/photos/:id', getPhotoById);
    app.get('/api/photos/:category', getPhotoByCategory);
    app.delete('/api/photos/:id', deletePhoto);
    app.post('/api/photos', postPhoto);
}
