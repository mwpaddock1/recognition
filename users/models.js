'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({

  username: {
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
UserSchema.methods.serialize = function () {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    pointsGiven: this.pointsGiven,
    pointsReceived: this.pointsReceived,
    pointsRemaining: this.pointsRemaining
  };
};
//validates the password
UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//applies the hashes to the password
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};