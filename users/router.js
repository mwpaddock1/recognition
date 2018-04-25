'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  //why are these capitalized, here and in models? is it the UserSchema is a specific thing?
  User,
  Transaction
} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const {
  router: authRouter,
  localStrategy,
  jwtStrategy
} = require('../auth');
const { jwtAuth } = require('../auth/router');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwt = require('jsonwebtoken');

// Post to register a new user
router.post('/', jsonParser, (req, res) => {

  //************************************************************************************************* */
  //have to translate loggedInUser.emailAddress to 'username' -where?
  const requiredFields = ['username', 'password'];
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

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
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
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
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
    firstName = '',
    lastName = ''
  } = req.body;
  // Username(emailAddress) and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({
      username
    })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({
        code: 500,
        message: 'Internal server error'
      });
    });
});

//should this just be '/' without the '/employees'?
//And, should there be a separate router for the transactions?
//GET the list of employees
router.get('/employees', jwtAuth, (req, res) => {
  employee
    .find()
    .then(employees => {
      res.json({
          employees: employee.map(
            (employee => employee.serialize()))

        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            message: 'Internal Server Error'
          })
        });
    });
});
//POST a new employee
router.post('/employees', jwtAuth, (req, res) => {
console.log(req.body)
//************************************************************************ */
//should this be User as in users/model?
  employee
    .create({
      employee: {
        pointsGiven: 0,
        pointsReceived: 0,
        pointsRemaining: 100,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailAddress: req.user.emailAddress
      },

    })
    .then(employees => res.status(201).json(employee.serialize()))
});
//**************************************************************************************** */
//have to figure out if we want a DELETE - would require admin login
//DELETE ENDPOINT an employee
// router.delete('/employees/:id', jwtAuth, (req, res) => {
//     employee
//         .findById(req.params.id)
//         .then(review => {
//             if (employees.employee_id !== req.user.userID) {
//                 console.log("Ids don't match");
//                 res.status(403).json({
//                     message: `${employees.employee_id} does not match ${req.user.userID}`
//                 });
//                 return null;
//             } else {
//                 return employee
//                     .findByIdAndRemove(req.params.id);
//             }
//         })
//         .then(deletedReview => {
//             if (deletedReview != null)
//                 return res.sendStatus(204);
//         });
// });

// GET the list of transactions
router.get('/transactions', jwtAuth, (req, res) => {
  transaction
    .find()
    .then(transactions => {
      res.json({
        transactions: transactions.map(
          (transactions) => transaction.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal Server Error'
      })
    });
});
//POST a new transaction
router.post('/transactions', jwtAuth, (req, res) => {
  // console.log(req.body)
  transaction
    .create({
      points: req.user.points,
      goal: req.user.goal,
      reason: req.user.reason,
      senderEmailAddress: req.user.senderEmailAddress,
      recipientEmailAddress: req.user.recipientEmailAddress
    })
    .then(transactions => res.status(201).json(transaction.serialize()))
});

//PUT ENDPOINT - the only things that are updated are the score tallies which fall in the employees section- 
//****************************************  have to get the points from Transactions info, too */
//do I have to use ID or can I revert to emailAddress?
router.put('/employees/:id', jwtAuth, (req, res) => {
  employee
    .findById(req.params.id)
    .then(employees => {
      if (employees.employee_id !== req.user.employee) {
        res.status(403).json({
          message: `${employees.employee_id} does not match ${req.user.employeeID}`
        });
        return null;
      }
      const updated = {};
      const updatedFields = ["pointsReceived", "pointsGiven", "pointsRemaining"];

      updatedFields.forEach(field => {
        if (field in req.body) {
          updated[field] = req.body[field];
        }
      });
      return updatedTrans.findByIdAndUpdate(req.params.id, {
        $set: updated
      }, {
        new: true
      });
    })
    .then(updatedTransaction => {
      if (updatedTransaction != null)
        return res.status(200).json(updatedTransaction.serialize())
    })
    .catch(err => res.status(500).json(err))
});
module.exports = {
  router
};
