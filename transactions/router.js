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
//POST a new transaction
router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields = ['points', 'goal', 'reason', 'recipientEmailAddress', 'senderEmailAddress'];
    let {
      points,
      goal,
      recipientEmailAddress,
      senderEmailAddress
    } = req.body;
    return Transaction.create({
        points: points,
        goal: goal,
        reason: reason,
        recipientEmailAddress: recipientEmailAddress,
        senderEmailAddress: senderEmailAddress
      })
      .then(transaction => res.status(201).json(transaction.serialize()))
  });
  
  // //GET a list of specific transactions by sender
  // router.get('/GetBySender/:senderEmailAddress', (req, res) => {
  //   Transaction
  //     .find({
  //       senderEmailAddress: req.params.senderEmailAddress
  //     })
  //     .then(transactions => {
  //       res.json({
  //           transactions: transactions.map(
  //             //does this work for multiple transactions??
  //             (transaction) => transaction.serialize())
  //         })
  //         .catch(err => {
  //           res.status(500).json({
  //             message: 'Internal TransactionServer Error'
  //           })
  //         });
  //     });
  // });
  // //GET a list of specific transactions by recipient
  // router.get('/GetByRecipient/:recipientEmailAddress', (req, res) => {
  //   Transaction
  //     .find({
  //       senderEmailAddress: req.params.recipientEmailAddress
  //     })
  //     .then(transactions => {
  //       res.json({
  //           transactions: transactions.map(
  //             //does this work for multiple transactions or is the response a different format when it's more than one?
  //             (transaction) => transaction.serialize())
  //         })
  //         .catch(err => {
  //           res.status(500).json({
  //             message: 'Internal TransactionServer Error'
  //           })
  //         });
  //     });
  // });
  
  // //PUT ENDPOINT - the only things that are updated are the score tallies which fall in the employees section- 
  
  // router.put('/:senderEmailAddress', (req, res) => {
  //     Employee
  //       .findOne({
  //         senderEmailAddress: req.params.senderEmailAddress
  //       })
  //       .then(employee => {
  //         res.json(employee.serialize())
  //       })
  //     const updated = {};
  //     const updatedFields = ["pointsReceived", "pointsGiven", "pointsRemaining"];
  
  //     updatedFields.forEach(field => {
  //       if (field in req.body) {
  //         updated[field] = req.body[field];
  //       }
  //     });
  //     return updatedTrans.findOneAndUpdate(req.params.senderEmailAddress, {
  //       $set: updated
  //     }, {
  //       new: true
  //     });
  //   })
  //   .then(updatedTransaction => {
  //     if (updatedTransaction != null)
  //       return res.status(200).json(updatedTransaction.serialize())
  //   })
  //   .catch(err => res.status(500).json(err))
    module.exports = {
        router
      };