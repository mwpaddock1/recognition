'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const TransactionSchema = mongoose.Schema({
  action: {
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
  recipientUsername: {
    type: String,
    required: true,
  },
  senderUsername: {
    type: String,
    required: true,
  },
  senderFirstName: {
    type: String,
    required: true,
  },
  senderLastName: {
    type: String,
    required: true,
  }
});

TransactionSchema.methods.serialize = function () {
  return {
    id: this._id,
    action: this.action,
    goal: this.goal,
    points: this.points,
    recipientUsername: this.recipientUsername,
    senderUsername: this.senderUsername,    
    senderFirstName: this.senderFirstName,
    senderLastName: this.senderLastName
  };
};
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = {
  Transaction
};