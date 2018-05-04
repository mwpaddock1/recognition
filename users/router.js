'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  Employee,
  Transaction
} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const {
  router: authRouter,
  localStrategy,
  jwtStrategy
} = require('../auth');
const {
  jwtAuth
} = require('../auth/router');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwt = require('jsonwebtoken');

// Post to register a new employee
router.post('/', jsonParser, (req, res) => {
  // console.log(req.body);
  const requiredFields = ['emailAddress', 'password', 'lastName', 'firstName'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
    console.log('missingField');
  }

  const stringFields = ['emailAddress', 'password', 'firstName', 'lastName'];
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
    console.log('not a string field')
  }

  // If the email address and password aren't trimmed we give an error.  Employees might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the employees know what's happening, rather than silently
  // trimming them and expecting the employee to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['emailAddress', 'password'];
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
    console.log('nontrimmed field');
  }

  const sizedFields = {
    emailAddress: {
      min: 7
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
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
    console.log('wrong size field');
  }

  let {
    emailAddress,
    password,
    firstName,
    lastName
  } = req.body;
  // console.log(emailAddress);
  return Employee.find({
      emailAddress: emailAddress
    },
    (err, employee) =>{
      if (err) return res.status(500).send(err)})
    .count()
    .then(count => {
      // console.log(count);
      if (count > 0) {
        // There is an existing employee with the same email address
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email Address already taken',
          location: 'emailAddress'
        });
      }
      // If there is no existing employee, hash the password
      // console.log(password);
      return Employee.hashPassword(password);
    })
    .then(hash => {
      // console.log(hash);
      return Employee.create({
        emailAddress: emailAddress,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        pointsGiven: '0',
        pointsReceived: '0',
        pointsRemaining: '100'
      });
    })
    .then(employee => {
      // console.log(employee);
      return res.status(201).json(employee.serialize());
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

//GET the list of employees
router.get('/', (req, res) => {
  Employee
    .find()
    .then(employees => {
      res.json({
           employees: employees.map(        
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
router.get('/:emailAddress', (req, res) => {
  Employee
    // .findById(req.params.id - but we want emailAddress)
    .findOne({emailAddress: req.params.emailAddress})
    .then(employee => {
        console.log(employee);
      res.json(employee.serialize())})
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

//**************************************************************************************** */
//have to figure out if we want a DELETE - would require admin login
//DELETE ENDPOINT an employee
// router.delete('/employees/:id', jwtAuth, (req, res) => {
//     employee
//         .findById(req.params.id)
//         .then(review => {
//             if (employees.employee_id !== req.employee.employeeID) {
//                 console.log("Ids don't match");
//                 res.status(403).json({
//                     message: `${employees.employee_id} does not match ${req.employee.employeeID}`
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
// router.get('/transactions', jwtAuth, (req, res) => {
//   transaction
//     .find()
//     .then(transactions => {
//       res.json({
//         transactions: transactions.map(
//           (transactions) => transaction.serialize())
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({
//         message: 'Internal Server Error'
//       })
//     });
// });
//POST a new transaction
// router.post('/', (req, res) => {
//   console.log(req.body)
//   Transaction
//     .create({
//       points: req.employee.points,
//       goal: req.employee.goal,
//       reason: req.employee.reason,
//       senderEmailAddress: req.employee.senderEmailAddress,
//       recipientEmailAddress: req.employee.recipientEmailAddress
//     })
//     .then(transactions => res.status(201).json(transaction.serialize()))
// });

//PUT ENDPOINT - the only things that are updated are the score tallies which fall in the employees section- 

// router.put('/employees/:id', jwtAuth, (req, res) => {
//   employee
//     .findById(req.params.id)
//     .then(employees => {
//       if (employees.employee_id !== req.body.employee) {
//         res.status(403).json({
//           message: `${employees.employee_id} does not match ${req.body.employeeID}`
//         });
//         return null;
//       }
//       const updated = {};
//       const updatedFields = ["pointsReceived", "pointsGiven", "pointsRemaining"];

//       updatedFields.forEach(field => {
//         if (field in req.body) {
//           updated[field] = req.body[field];
//         }
//       });
//       return updatedTrans.findByIdAndUpdate(req.params.id, {
//         $set: updated
//       }, {
//         new: true
//       });
//     })
//     .then(updatedTransaction => {
//       if (updatedTransaction != null)
//         return res.status(200).json(updatedTransaction.serialize())
//     })
//     .catch(err => res.status(500).json(err))
// });
module.exports = {
  router
};