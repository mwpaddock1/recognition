// 'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;

chai.should();

chai.use(chaiHttp);

// jumbling here on Users vs Employees... ********************************************************************
describe('Users', function () {
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
  describe('employee list page', function () {
    it('should exist', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          //so subsequent .then blocks can access the response object
          res = _res;
          res.should.have.status(200);

        });
    });
  });
  it('should return a list of employees with the right fields on GET', function () {
    return chai.request(app)
      .get('/employees')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(
            'id', 'firstName', 'lastName', 'emailAddress', 'pointsGiven', 'pointsReceived', 'pointsRemaining');
        });
      });
  });

it('should return a list of transactions with the right fields on GET', function () {
  return chai.request(app)
    .get('/transactions')
    .then(function (res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.above(0);
      res.body.forEach(function (item) {
        expect(item).to.be.a('object');
        expect(item).to.have.all.keys(
          'id', 'reason', 'goal', 'points', 'senderEmailAddress', 'recipientEmailAddress');
      });
    });
});
})

//describe('recognition page', function () {
//   it('should exist', function () {
//     return chai.request(app)
//       .get('/')
//       .then(function (res) {
//         res.should.have.status(200);
//       });
//   });
// });