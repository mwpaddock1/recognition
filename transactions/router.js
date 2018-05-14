'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  Transaction
} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
// const {
//   router: authRouter,
//   localStrategy,
//   jwtStrategy
// } = require('../auth');
// const {
//   jwtAuth
// } = require('../auth/router');
// passport.use(localStrategy);
// passport.use(jwtStrategy);
// const jwt = require('jsonwebtoken');
//POST a new transaction
router.post('/', (req, res) => {
  const requiredFields = ['points', 'goal', 'action', 'recipientEmailAddress', 'senderEmailAddress'];
  let {
    points,
    goal,
    action,
    recipientEmailAddress,
    senderEmailAddress
  } = req.body;
  return Transaction.create({
      points: points,
      goal: goal,
      action: action,
      recipientEmailAddress: recipientEmailAddress,
      senderEmailAddress: senderEmailAddress
    })
    .then(transaction => res.status(201).json(transaction.serialize()));
});
//GET the list of transactions
router.get('/', (req, res) => {
  Transaction
    .find()
    .then(transactions => {
      res.json({
          transactions: transactions.map(
            (transaction => transaction.serialize()))
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            message: 'Internal Server Error'
          })

        });
      // console.log(`this is a ${transaction}`);
    });
});

//GET a transaction sent from a specific
// 
router.get('/:senderEmailAddress', (req, res) => {
  Transaction
    .findOne({
      senderEmailAddress: req.params.senderEmailAddress
    })
    .then(transaction => {
      res.json(transaction.serialize());
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal TransactionServer Error'
      })
    });
});
//GET all the transactions from a specific sender
// 
router.get('/GetBySender/:senderEmailAddress', (req, res) => {
  Transaction
    .find({
      senderEmailAddress: req.params.senderEmailAddress
    })
    .then(transactions => {
      res.json(transactions.map(transaction => {
        return transaction.serialize()
      }));

    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal TransactionServer Error'
      })
    });
});

//GET all the transactions for a recipient
router.get('/GetByRecipient/:recipientEmailAddress', (req, res) => {
  Transaction
    .find({
      recipientEmailAddress: req.params.recipientEmailAddress
    })
    .then(transactions => {
      res.json(transactions.map(transaction => {
        return transaction.serialize()
      }));
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal TransactionServer Error'
      })
    });
});

module.exports = {
  router
};