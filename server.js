const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const api = require('./controllers/API');
const open = require('open');
const app = express();
const PORT = process.env.PORT || 3090;
// app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', api);
app.listen(PORT);
console.log('App is running on: http://localhost:' + PORT);
open('http://localhost:3090');


