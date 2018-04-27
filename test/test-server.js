// 'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const {Employee, Transaction} = require('../users/models');
const {app, runServer, closeServer} = require('../server.js');

const expect = chai.expect;

chai.should();

chai.use(chaiHttp);

describe('Employee', function () {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function () {
    return runServer();
  });
  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function () {
    return closeServer();
  });

  it('should add an employee on POST', function() {
    // const newItem = {firstName: 'Joe', lastName: 'Schmoe', emailAddress: 'jschmoe@fizzbuzz.com', pointsGiven: 0, pointsReceived: 0, pointsRemaining: 100};
     const newItem = {firstName: faker.firstName, lastName: faker.lastName, emailAddress: faker.emailAddress, password: faker.password};
     
    return chai.request(app)
      .post('/employees')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'firstName', 'lastName', 'emailAddress', 'pointsGiven', 'pointsReceived', 'pointsRemaining');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });
});

// //Here's the test for POST requests to /transactions.
// it('should add a transaction on POST', function() {
//     // const newItem = {reason: 'helping', goal: 'Sales', points: 10, senderEmailAddress: 'jschmoe@fizzbuzz.com', recipientEmailAddress: 'tperkins@fizzbuzz.com'};
//   const newTrans = {reason: faker.reason, goal: faker.goal, points: faker.points, senderEmailAddress: faker.senderEmailAddress, recipientEmailAddress: faker.recipientEmailAddress};
//     return chai.request(app)
//       .post('/transactions')
//       .send(newTrans)
//       .then(function(res) {
//         expect(res).to.have.status(201);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body).to.include.keys('id','reason', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
//         expect(res.body.id).to.not.equal(null);
//         // response should be deep equal to `newItem` from above if we assign
//         // `id` to it from `res.body.id`
//         expect(res.body).to.deep.equal(Object.assign(newTrans, {id: res.body.id}));
//       });
//   });

//here's a possible get check
//   describe('employee list page', function () {
//     it('should exist', function () {
//       return chai.request(app)
//         .get('/')
//         .then(function (res) {
//           //so subsequent .then blocks can access the response object
//           res = _res;
//           res.should.have.status(200);

//         });
//     });
//   });
//   it('should return a list of employees with the right fields on GET', function () {
//     return chai.request(app)
//       .get('/employees')
//       .then(function (res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('array');
//         expect(res.body.length).to.be.above(0);
//         res.body.forEach(function (item) {
//           expect(item).to.be.a('object');
//           expect(item).to.have.all.keys(
//             'id', 'firstName', 'lastName', 'emailAddress', 'pointsGiven', 'pointsReceived', 'pointsRemaining');
//         });
//       });
//   });

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
// })

//describe('recognition page', function () {
//   it('should exist', function () {
//     return chai.request(app)
//       .get('/')
//       .then(function (res) {
//         res.should.have.status(200);
//       });
//   });
// });