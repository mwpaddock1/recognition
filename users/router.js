// 'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  User
} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

// Post to register a new employee
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'lastName', 'firstName'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 7
    },
    password: {
      min: 8,
      max: 72
    },
    lastName: {
      min: 2,
      max: 30
    },
    firstName: {
      min: 2,
      max: 15
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField ?
        `Must be at least ${sizedFields[tooSmallField]
          .min} characters long` : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {
    username,
    password,
    firstName,
    lastName
  } = req.body;

  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({
        username
      },
      (err, employee) => {
        if (err) return res.status(500).send(err)
      }
    )
    .count()
    .then(count => {
      console.log(count);
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email Address already taken',
          location: 'username'
        });
      }

      return User.hashPassword(password);
    })
    .then(hash => {
      console.log(hash);

      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        pointsGiven: '0',
        pointsReceived: '0',
        pointsRemaining: '100'
      });
    })
    .then(user => {
      console.log(user);
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({
        code: 500,
        message: 'Internal server error'
      });
    });
});
//GET the list of employees
router.get('/', (req, res) => {
  User
    .find()
    .then(users => {
      res.json({
        users: users.map(
          (user => user.serialize()))
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    });
});

//GET a specific employee
router.get('/:username', (req, res) => {
  User
    .findOne({
      username: req.params.username
    })
    .then(user => {
      res.json(user.serialize())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went horribly awry'
      });
    });
});

//PUT ENDPOINT -Points Given 
router.put('/PutPointsSentBy/:username', (req, res) => {
  const updated = {};
  const updateableFields = ['pointsGiven', 'pointsRemaining'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  let query = {
    username: req.params.username
  }
  User
    .findOneAndUpdate(query, {
      $set: updated
    }, {
      returnNewDocument: true
    })

    .then(updatedUser => {
      if (updatedUser != null)
        return res.status(204).end();
    })
    .catch(err => res.status(500).json(err))
})

//PUT ENDPOINT -Points Received 
router.put('/PutPointsGivenToRecipient/:username', (req, res) => {
  const updated = {};
  const updateableFields = ['pointsReceived'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });
  let query = {
    username: req.params.username
  }
  User
    .findOneAndUpdate(query, {
      $set: updated
    }, {
      returnNewDocument: true
    })
    .then(updatedUser => {
      console.log(updatedUser);
      if (updatedUser != null) {
        return res.status(204).end();
      }
    })
    .catch(err => res.status(500).json(err))
})

//DELETE ENDPOINT an employee
router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted employee with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

module.exports = {
  router
};