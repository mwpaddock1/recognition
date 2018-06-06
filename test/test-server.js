'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET
} = require('../config');
const faker = require('faker');
const {
  User
} = require('../users');
const {
  Transaction
} = require('../transactions');
const {
  app,
  runServer,
  closeServer
} = require('../server');
const express = require('express');
const expect = chai.expect;
const mongoose = require('mongoose');
chai.should();
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedRecognitionData() {
  console.info('seeding recognition data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.email(),
      password: faker.internet.password()
    });
  }
  // this will return a promise
  return User.insertMany(seedData);
}

describe('users API resource', function () {
  afterEach(function () {
    return tearDownDb();
  });
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedRecognitionData()
  });

  after(function () {
    return closeServer();
  });
  describe('users POST endpoint', function () {
    it('should add a user on POST', function () {
      const newItem = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.email(),
        password: faker.internet.password()
      };

      return chai.request(app)
        .post('/users')
        .send(newItem)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'firstName', 'lastName', 'username', 'pointsGiven', 'pointsReceived', 'pointsRemaining');
          expect(res.body.id).to.not.equal(null);
        })
    });
  });

  describe('users GET endpoint', function () {
    it('should return all users', function () {
      let res;
      return chai.request(app)
        .get('/users')
        .then(_res => {
          //so subsequent .then blocks can access the response object
          res = _res;
          res.should.have.status(200);
          res.body.users.should.have.length.of.at.least(1);
          return User.count();
        })
        .then(count => {
          res.body.users.should.have.lengthOf(count);
        });
    });
  });

  describe('single user GET endpoint', function () {
    it('should return a single user', function () {
      let testUser;
      return User.findOne()
        .then(user => {
          testUser = user;
          return chai.request(app)
            .get('/users/' + user.username)
            .then(function (res) {
              res.should.have.status(200);
              expect(res.body.username).to.equal(testUser.username);
            })
        })
    })
  });

  describe('user PUT to Recipient endpoint', function () {
    it('should update user points received tally', function () {
      let testUpdateData = {
        pointsReceived: '10',
      };
      return User
        .findOne()
        .then(user => {
          testUpdateData.username = user.username;
          testUpdateData.id = user.id;
          return chai.request(app)
            .put('/users/PutPointsGivenToRecipient/' + user.username)
            .send(testUpdateData);
        })
        .then(res => {
          let updatedUser = User.findById(testUpdateData.id);
          res.should.have.status(204);
          expect(res.body.pointsReceived).to.equal(updatedUser.pointsReceived);
        });
    });
  });

  describe('user PUT by Sender endpoint', function () {
    it('should update user points given/remaining tallies', function () {
      let testUpdateData = {
        pointsGiven: '10',
        pointsRemaining: '90'
      };
      return User
        .findOne()
        .then(user => {
          testUpdateData.username = user.username;
          testUpdateData.id = user.id;
          return chai.request(app)
            .put('/users/PutPointsSentBy/' + user.username)
            .send(testUpdateData);
        })

        .then(res => {
          let updatedUser = User.findById(testUpdateData.id);
          res.should.have.status(204);
          expect(res.body.pointsGiven).to.equal(updatedUser.pointsGiven);
          expect(res.body.pointsRemaining).to.equal(updatedUser.pointsRemaining);
        });
    });
  });

  describe('user DELETE endpoint', function () {
    it('should delete a user on DELETE', function () {
      let testUser;
      return User
        .findOne()
        .then(_user => {
          testUser = _user;
          return chai.request(app).delete(`/users/${testUser.id}`);
        })
        .then(function (res) {
          res.should.have.status(204);
          return User.findById(testUser.id);
        })
        .then(_testUser => {
          expect(_testUser).to.be.null;
        });
    });
  })
})

function seedTransactionData() {
  const seedTrxData = [];
  for (let i = 1; i <= 10; i++) {
    seedTrxData.push({
      action: faker.lorem.words(),
      goal: faker.lorem.words(),
      points: faker.random.number({
        min: 5,
        max: 10
      }),
      senderUsername: faker.internet.email(),
      senderLastName: faker.lorem.words(),
      senderFirstName: faker.lorem.words(),
      recipientUsername: faker.internet.email()
    });

  }
  return Transaction.insertMany(seedTrxData);
}

describe('transactions API resource', function () {
  afterEach(function () {
    return tearDownDb();
  });
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function () {
    return seedTransactionData()
  });

  after(function () {
    return closeServer();
  });

  describe('transactions POST endpoint', function () {
    it('should add a transaction on POST', function () {
      const newTrans = {
        action: faker.lorem.words(),
        goal: faker.lorem.words(),
        points: faker.lorem.words(),
        senderUsername: faker.internet.email(),
        senderLastName: faker.lorem.words(),
        senderFirstName: faker.lorem.words(),
        recipientUsername: faker.internet.email()
      };

      return chai.request(app)
        .post('/transactions')
        .send(newTrans)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'action', 'goal', 'points', 'senderUsername', 'senderLastName', 'senderFirstName', 'recipientUsername');
          expect(res.body.id).to.not.equal(null);
        })
    });
  });

  describe('transactions GET endpoint', function () {
    it('should return all transactions', function () {
      let res;
      return chai.request(app)
        .get('/transactions')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.transactions.should.have.length.of.at.least(1);
          return Transaction.count();
        })
        .then(count => {
          res.body.transactions.should.have.lengthOf(count);
        });
    });
  });

  describe('GET a single transaction by senderUsername', function () {
    it('should return a transaction sent by a particular user on GET', function () {
      let testTransaction;
      return Transaction.findOne()
        .then(transaction => {
          testTransaction = transaction;
          return chai.request(app)
            .get('/transactions/' + transaction.senderUsername)
            .then(function (res) {
              res.should.have.status(200);
              expect(res.body.senderUsername).to.equal(testTransaction.senderUsername)
            })
        });
    });
  });

  describe('GET all transactions from a senderUsername', function () {
    it('should GET all of the transactions sent by a particular user on GET', function () {
      let testTransaction;
      return Transaction.findOne()
        .then(transaction => {
          testTransaction = transaction;
          return chai.request(app)
            .get('/transactions/GetBySender/' + testTransaction.senderUsername)
            .then(function (res) {
              res.should.have.status(200);
              expect(res.body[0].senderUsername).to.equal(testTransaction.senderUsername)
            })
        });
    });
  });

  describe('GET all transactions for a recipientUsername', function () {
    it('should return a list of all transactions received by a particular user on GET', function () {
      let testTransaction;
      return Transaction.findOne()
        .then(transaction => {
          testTransaction = transaction;
          return chai.request(app)
            .get('/transactions/GetByRecipient/' + testTransaction.recipientUsername)
            .then(function (res) {
              res.should.have.status(200);
              expect(res.body[0].recipientUsername).to.equal(testTransaction.recipientUsername)
            });
        });
    })
  })
});