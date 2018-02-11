import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import 'open';
import 'ejs';
import mongoose from 'mongoose';
import dbConfig from './dbConfig';
import router from './router';

mongoose.Promise = Promise;
// db setup
mongoose.connect(dbConfig.connectionString);

// app setup
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('view engine', 'ejs');
router(app);

// Server setup
const PORT = process.env.PORT || 3090;
app.listen(PORT);

console.log(`App is running on: http://localhost:${PORT}`);
// open('http://localhost:3090');
