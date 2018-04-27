'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { Employee } = require('../users/models');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((emailAddress, password, callback) => {
  let employee;
  Employee.findOne({ emailAddress: emailAddress })
    .then(_employee => {
      employee = _employee;
      if (!employee) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect email address or password'
        });
      }
      return employee.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect email address or password'
        });
      }
      return callback(null, employee);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    
    // Only allow HS256 tokens - the same as the ones we issue
    //from slack:
   // xhr.setRequestHeader('Authorization', ('BEARER '+ data.authToken)); 
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.employee);
  }
);

module.exports = { localStrategy, jwtStrategy };