'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  //*********************************************************************************** */
  //have to figure out if this should be username or emailAddress (remember the login form has email and the signup form has emailAddress so we can use the hidden id=recipient input)

  emailAddress: {
    type: String,
    required: true,
    unique: true
  },
  //********************************************************************* */
  //password is only for the auth so does it belong here?
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  //****************************************************************************************** */
  //so if the password belongs in the UserSchema, do these?
  pointsGiven: {
    type: String,
    required: true
  },
  pointsRecevied: {
    type: String,
    required: true
  },
  pointsRemaining: {
    type: String,
    required: true
  }
});

//validates the password
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
//applies the hashes to the password
UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};
//This schema doesn't include the password - only the parts we want
UserSchema.methods.serialize = function () {
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
const User = mongoose.model('User', UserSchema);

const TransactionSchema = mongoose.Schema({
  points: {
    type: Number,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  reason: {
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

TransactionSchema.methods.serialize = function () {
  return {
    id: this._id,
    points: this.points,
    reason: this.reason,
    recipientEmailAddress: this.recipientEmailAddress,
    senderEmailAddress: this.senderEmailAddress
  }
}

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = {
  User,
  Transaction
};