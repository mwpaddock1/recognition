'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
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
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
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
    emailAddress: this.emailAddress || '', 
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

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
    unique: true
  },
  senderEmailAddress: {
    type: String,
    required: true,
    unique: true
  }

});

TransactionSchema.methods.serialize = function() {
  return {
    id: this._id,
    points: this.points,
    reason: this.reason,
    recipientEmailAddress: this.recipientEmailAddress,
    senderEmailAddress: this.senderEmailAddress
  }
}

const Transaction = mongoose.model('Transaction', TransactionSchema)

const User = mongoose.model('User', UserSchema);
module.exports = {
  User, Transaction
};