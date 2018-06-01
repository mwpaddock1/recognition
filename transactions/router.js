'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const {
  Transaction
} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

//POST a new transaction
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['points', 'goal', 'action', 'recipientEmailAddress', 'senderEmailAddress'];
  let {
    points,
    goal,
    action,
    recipientUsername,
    senderUsername,
    senderFirstName,
    senderLastName
  } = req.body;
  
  return Transaction.create({
      points,
      goal,
      action,
      recipientUsername,
      senderUsername,
      senderFirstName,
      senderLastName
    })
    .then(transaction => {
      console.log(transaction);
      return res.status(201).json(transaction.serialize());
    });
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
    });
});

//GET a transaction sent from a specific employee
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

//GET all the transactions given to a recipient
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