'use strict';
//dotenv loads environment variables from a .env file into the process
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('common'));
app.use(express.static('public'));

//using Mongoose to connect to the server
const mongoose = require('mongoose');
const passport = require('passport');

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names

const {
  router: usersRouter 
} = require('./users');
const {
  router: transactionsRouter
} = require('./transactions');
const {
  router: authRouter,
  localStrategy,
  jwtStrategy
} = require('./auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jsonParser = bodyParser.json();
const {
  employees
} = require('./models');
const {
  transactions
} = require('./transactions');
mongoose.Promise = global.Promise;
//get the PORT and the database from config
const {
  PORT,
  DATABASE_URL
} = require('./config');

app.use(express.json());

//CORS

//Pink square means that the source line is on the execution path of a failing test
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/employees', usersRouter);
app.use('/transactions', transactionsRouter);
app.use('api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', {
  session: false
});
// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'success' //'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;
//starts express server and connects to the db
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(PORT, () => {
            console.log(`Your app is listening on port ${PORT}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {
  app,
  jwtAuth,
  runServer,
  closeServer
};