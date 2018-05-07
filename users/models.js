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
    required: true
  },
  lastName: {
    type: String,
    required: true
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
// console.log('made it here - EmployeeSchema is set up');
//validates the password
EmployeeSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
//applies the hashes to the password
EmployeeSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};
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
const Employee = mongoose.model('Employee', EmployeeSchema);

const TransactionSchema = mongoose.Schema({
  reason: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  points: {
    type: String,
    required: true
  },
  recipientEmailAddress: {
    type: String,
    required: true,
  },
  senderEmailAddress: {
    type: String,
    required: true,
  }
});
console.log('made it here - TransactionSchema is set up');
TransactionSchema.methods.serialize = function () {
  return {
    id: this._id,
    reason: this.reason,
    goal: this.goal,
    points: this.points,
    recipientEmailAddress: this.recipientEmailAddress,
    senderEmailAddress: this.senderEmailAddress
  };
 };
const Transaction = mongoose.model('Transaction', TransactionSchema);

console.log('made it here after Transaction serialized:');
module.exports = {
  Employee,
  Transaction
};