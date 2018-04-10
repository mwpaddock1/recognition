'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
// const {
//   router: usersRouter
// } = require('./users');
// const {
//   router: authRouter,
//   localStrategy,
//   jwtStrategy
// } = require('./auth');


mongoose.Promise = global.Promise;

const {
  PORT,
  DATABASE_URL
} = require('./config');
const app = express();
//logging
app.use(morgan('common'));
app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});
// passport.use(localStrategy);
// passport.use(jwtStrategy);

// app.use('/api/users/', usersRouter);
// app.use('/api/auth/', authRouter);
// // A protected endpoint which needs a valid JWT to access it
// app.get('/api/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

// app.use('*', (req, res) => {
//   return res.status(404).json({
//     message: 'Not Found'
//   });
// });






//let JWT = localStorage.getItem('JWT');

app.use(express.static('public'));
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {
  employeeList
} = require('./models');

employeeList.create('demo1', 'josephine', 'josey@fizzbuzz.com');
employeeList.create('example', 'mary', 'mary@fizzbuzz.com');

app.get('/employee-list', (req, res) => {
  res.json(employeeList.get());
});


// app.post();
//app.put();
//app.delete();

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

// function runServer() {
//   return new Promise((resolve, reject) => {
//     mongoose.connect(DATABASE_URL, {
//       useMongoClient: true
//     }, err => {
//       if (err) {
//         return reject(err);
//       }
//       server = app
//         .listen(PORT, () => {
//           console.log(`Your app is listening on port ${PORT}`);
//           resolve();
//         })
//         .on('error', err => {
//           mongoose.disconnect();
//           reject(err);
//         });
//     });
//   });
// }

// function closeServer() {
//   return mongoose.disconnect().then(() => {
//     return new Promise((resolve, reject) => {
//       console.log('Closing server');
//       server.close(err => {
//         if (err) {
//           return reject(err);
//         }
//         resolve();
//       });
//     });
//   });
// }

// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// }

module.exports = {
  app,
  // runServer,
  // closeServer
};
if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}
//environment variable called PORT - it's value is set outside of this app
