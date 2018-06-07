'use strict';

require('dotenv').config();
const { PORT, TEST_DATABASE_URL } = require('./config');
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('common'));
app.use(express.static('public'));

const mongoose = require('mongoose');
const passport = require('passport');

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
  users
} = require('./users');
const {
  transactions
} = require('./transactions');
mongoose.Promise = global.Promise;

app.use(express.json());

//CORS
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

app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);
app.use('/api/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', {
  session: false
});

app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'successfulAuth' 
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({
    message: 'Not Found'
  });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
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
  runServer,
  closeServer
};