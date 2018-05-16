'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function (employee) {
  return jwt.sign({
    employee
  }, config.JWT_SECRET, {
    subject: employee.emailAddress,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {
  session: false
});
router.use(bodyParser.json());
// The employee provides an email address and password to login
router.post('/login', localAuth, (req, res) => {
console.log(req.body);
  const authToken = createAuthToken(req.employee.serialize());
  res.json({
    authToken
  });
});

const jwtAuth = passport.authenticate('jwt', {
  session: false
});

// The employee exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.employee);
  res.json({
    authToken
  });
});

module.exports = {
  router,
  jwtAuth
};