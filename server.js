const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const open = require('open');
const mongoose = require('mongoose');
const ejs = require('ejs');
const connectionString = require('./dbConfig');

// db setup
mongoose.connect(connectionString);

// app setup
const app = express();
const router = require('./router.js');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.set('view engine', 'ejs');
router(app);

//Server setup
const PORT = process.env.PORT || 3090;
app.listen(PORT);
console.log('App is running on: http://localhost:' + PORT);
open('http://localhost:3090');


