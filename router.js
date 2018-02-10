import cors from 'cors';
import express from 'express';
import passport from 'passport';
import indexVM from './viewModels';
import {
  getPhotos,
  getPhotoById,
  getPhotoByCategory,
  postPhoto,
  updatePhoto,
  deletePhoto,
  uploadFile,
} from './controllers/photoController';
import {
  postCategory,
  getCategories,
  updateCategory,
  removeCategory,
} from './controllers/categoryController';
import { signup, signin } from './controllers/authenticationController';
import passportService from './services/passport';

passportService();

passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const options = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

export default function router(app) {
  app.options('*', cors()); // include before other routes;
  app.use('/Assets/uploads', express.static(`${__dirname}/Assets/uploads`));
  app.get('/', cors(options), indexVM);
  app.post('/api/signup', signup);
  app.post('/api/signin', requireSignin, signin);
  app.get('/api/photos', cors(options), getPhotos);
  app.get('/api/photos/:id', getPhotoById);
  app.get('/api/photos/:category', getPhotoByCategory);
  app.put('/api/photos', cors(options), updatePhoto);
  app.delete('/api/photos/:id', cors(options), deletePhoto);
  app.post('/api/photos', cors(options), uploadFile, postPhoto);
  app.get('/api/categories', cors(options), getCategories);
  app.post('/api/categories', cors(options), postCategory);
  app.put('/api/categories', updateCategory);
  app.delete('/api/categories/:title', cors(options), removeCategory);
}
