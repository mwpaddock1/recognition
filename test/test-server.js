// 'use strict';
//DATABASE_URL=mongodb://legal:staffer@ds111188.mlab.com:11188/recognitiondb
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET
} = require('../config');
const faker = require('faker');
const {
  Employee,
  Transaction
} = require('../users');
const {
  app,
  runServer,
  closeServer
} = require('../server.js');
const express = require('express');
const expect = chai.expect;
const mongoose = require('mongoose');
chai.should();

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedRecognitionData() {
  console.info('seeding recognition data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      emailAddress: faker.internet.email(),
      password: faker.internet.password()
      // pointsGiven: faker.lorem.words(),
      // pointsReceived: faker.lorem.words(),
      // pointsRemaining: faker.lorem.words(),
    });
    //console.log(seedData);
  }
  // this will return a promise
  return Employee.insertMany(seedData);
}

describe('employees API resource', function () {
  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });
  before(function () {
    return runServer();
  });

  beforeEach(function () {
    return seedRecognitionData()
  });
  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function () {
    return closeServer();
  });
  describe('employees POST endpoint', function () {
    it('should add an employee on POST', function () {
      // const newItem = {firstName: 'Joe', lastName: 'Schmoe', emailAddress: 'janeFonda@fizzbuzz.com', password: 'password1', pointsGiven: '0', pointsReceived: '0', pointsRemaining: '100'};
      const newItem = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        emailAddress: faker.internet.email(),
        password: faker.internet.password()
      };

      return chai.request(app)
        .post('/employees')
        .send(newItem)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'firstName', 'lastName', 'emailAddress', 'pointsGiven', 'pointsReceived', 'pointsRemaining');
          expect(res.body.id).to.not.equal(null);
        })
    });
  });
  // POST requests to /transactions.
  // describe('transactions POST endpoint', function () {
  //   it('should add a transaction on POST', function () {
  //     const newTrans = {reason: 'helping', goal: 'Sales', points: '10', senderEmailAddress: 'janechmoe@fizzbuzz.com', recipientEmailAddress: 'tperkins@fizzbuzz.com'};
  //     // const newTrans = {
  //     //   reason: faker.lorem.words(),
  //     //   goal: faker.lorem.words(),
  //     //   points: faker.lorem.words(),
  //     //   senderEmailAddress: faker.internet.email(),
  //     //   recipientEmailAddress: faker.internet.email()
  //     // };
  //     console.log (newTrans);
  //     return chai.request(app)
  //       .post('/transactions')
  //       .send(newTrans)
  //       .then(function (res) {
  //         expect(res).to.have.status(201);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.include.keys('id', 'reason', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
  //         expect(res.body.id).to.not.equal(null);
  //         // response should be deep equal to `newItem` from above if we assign
  //         // `id` to it from `res.body.id`
  //         // expect(res.body).to.deep.equal(Object.assign(newTrans, {
  //         //   id: res.body.id
  //         });
  //       });
  //   });

  describe('employees GET endpoint', function () {
    it('should return all employees', function () {
      let res;
      return chai.request(app)
        .get('/employees')
        .then(_res => {
          //so subsequent .then blocks can access the response object
          res = _res;
          res.should.have.status(200);
          res.body.employees.should.have.length.of.at.least(1);
          // console.log(res.body.length);
          // console.log(Employee.count);
          return Employee.count();
        })

        .then(count => {
          res.body.employees.should.have.lengthOf(count);
        });
    });
  });
  describe('single employee GET endpoint', function () {
    it('should return a single employee', function () {

      let testEmployee;
      return Employee.findOne()
        .then(employee => {
          testEmployee = employee;
          return chai.request(app)
            .get('/employees/' + employee.emailAddress)
            .then(function (res) {
              res.should.have.status(200);
              expect(res.body.emailAddress).to.equal(testEmployee.emailAddress);  
            })
        })
    })
  })



  // describe('transactions GET endpoint', function () {
  // it('should return a list of transactions with the right fields on GET', function () {
  //   return chai.request(app)
  //     .get('/transactions')
  //     .then(function (res) {
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body).to.be.a('array');
  //       expect(res.body.length).to.be.above(0);
  //       res.body.forEach(function (item) {
  //         expect(item).to.be.a('object');
  //         expect(item).to.have.all.keys(
  //           'id', 'reason', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
  //       });
  //     });
  // });
});