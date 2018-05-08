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
  Employee
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
  });

  // describe('employee PUT endpoint', function () {
  //   it('should update employee points tallies', function () {
  //     const updateData = {
  //       pointsGiven: '10',
  //       pointsReceived: '20',
  //       pointsRemaining: '90'
  //     };

  //     return Employee
  //       .findOne()
  //       .then(employee => {
  //         updateData.id = employee.id;

  //         return chai.request(app)
  //           .put(`/employees/${employee.id}`)
  //           .send(updateData);
  //       })
  //       .then(res => {
  //         res.should.have.status(204);
  //         return Employee.findById(updateData.id);
  //       })
  //       .then(employee => {
  //         employee.pointsGiven.should.equal(updateData.pointsGiven);
  //         employee.pointsGiven.should.equal(updateData.pointsGiven);
  //         employee.pointsGiven.should.equal(updateData.pointsGiven);
  //       });
  //   });
  // });

  describe('employee DELETE endpoint', function () {
    it('should delete an employee on DELETE', function () {
      let testEmployee;
      return Employee
        .findOne()
        .then(_employee => {
          testEmployee = _employee;
          console.log(testEmployee);
          return chai.request(app).delete(`/employees/${testEmployee.emailAddress}`);
        })
        .then(function (res) {
          res.should.have.status(204);
          return Employee.findById(testEmployee.id);
        })
        .then(_testEmployee => {
          expect(_testEmployee).to.be.null;
        });
    });
  })
})

function seedTransactionData() {
  console.info('seeding transaction data');
  const seedTrxData = [];
  for (let i = 1; i <= 10; i++) {
    seedTrxData.push({
      action: faker.lorem.words(),
      goal: faker.lorem.words(),
      points: faker.random.number({
        min: 5,
        max: 10
      }),
      senderEmailAddress: faker.internet.email(),
      recipientEmailAddress: faker.internet.email()
    });
   
  }
  // this will return a promise
  return Transaction.insertMany(seedTrxData);
}
describe('transactions API resource', function () {
  afterEach(function () {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });
  before(function () {
    return runServer();
  });
  beforeEach(function () {
    return seedTransactionData()
  });
  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function () {
    return closeServer();
  });

  //POST requests to /transactions.
  describe('transactions POST endpoint', function () {
    it('should add a transaction on POST', function () {
      // const newTrans = {
      //   action: 'helping',
      //   goal: 'Sales',
      //   points: '10',
      //   recipientEmailAddress: 'tperkins@fizzbuzz.com',
      //   senderEmailAddress: 'janechmoe@fizzbuzz.com'
      // };
      const newTrans = {
        action: faker.lorem.words(),
        goal: faker.lorem.words(),
        points: faker.lorem.words(),
        senderEmailAddress: faker.internet.email(),
        recipientEmailAddress: faker.internet.email()
      };
      console.log(newTrans);
      return chai.request(app)
        .post('/transactions')
        .send(newTrans)
        .then(function (res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'action', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
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
          //so subsequent .then blocks can access the response object
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
  
     describe('transactions GET by senderEmailAddress', function () {
      it('should return a list of all transactions sent by a particular employee on GET', function (){
        let testTransaction;
        return Transaction.find()
        .then(transaction => {
          testTransaction = transaction;
          return chai.request(app)
          .get('/transactions/' + transaction.senderEmailAddress)
          .then(function (res) {
            res.should.have.status(200);
            expect(res.body.senderEmailAddress).to.equal(testTransaction.senderEmailAddress)
          })
        })
      })
    })
  //   describe('transactions GET by recipientEmailAddress', function () {
  //     it('should return a list of all transactions received by a particular employee on GET', function (){
  //       let testTransactions;
  //       return Transaction.find()
  //       .then(transactions => {
  //         testEmployees = employees;
  //         return chai.request(app)
  //         .get('/transactions/' + transaction.recipientEmailAddress)
  //         .then(function (res) {
  //           res.should.have.status(200);
  //           expect(res.body.recipientEmailAddress).to.equal(testEmployees.recipientEmailAddress)
  //         })
  //       })
  //     })
  //   })

})