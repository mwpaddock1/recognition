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
      action: this.action,
      goal: this.goal,
      points: this.points,
      recipientEmailAddress: this.recipientEmailAddress,
      senderEmailAddress: this.senderEmailAddress
    };
   };
  const Transaction = mongoose.model('Transaction', TransactionSchema);
  
  console.log('made it here after Transaction serialized:');
  module.exports = {
    Transaction
  };