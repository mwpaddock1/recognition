'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EmployeeSchema = mongoose.Schema({
  //(remember the login form has email and the signup form has emailAddress so we can use the hidden id=recipient input)

  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    // required: true
    default: ''
  },
  lastName: {
    type: String,
    // required: true
    default: ''
  },
  pointsGiven: {
    type: String,
    default: '0'
  },
  pointsReceived: {
    type: String,
    default: '0'
  },
  pointsRemaining: {
    type: String,
    default: '100'
  }
});
//This schema doesn't include the password - only the parts we want
EmployeeSchema.methods.serialize = function () {
  return {
    id: this._id,
    emailAddress: this.emailAddress,
    firstName: this.firstName,
    lastName: this.lastName,
    pointsGiven: this.pointsGiven,
    pointsReceived: this.pointsReceived,
    pointsRemaining: this.pointsRemaining
  };
};
//validates the password
EmployeeSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//applies the hashes to the password
EmployeeSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = {
  Employee
};