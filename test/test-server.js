// 'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const expect = chai.expect;

chai.should();

chai.use(chaiHttp);
// it('should exist on Get', function() {
//     return chai.request(app)
//     .get('/')
//     .then (function(res) {
//         expect(res).to.have.status(200);
//     })
// })
describe('employee list page', function () {
    it('should exist', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          //so subsequetn .then blocks can access the response object
          res=_res;
          res.should.have.status(200);
          
        });
    });
  });

  it('should return employees with the right fields', function() {
    //strategy: get back all employees and ensure they have the expected keys
    let resEmployee;
    return chai.request(app)
    .get('/employee-list')
    .then(function(res) {
      expect(res).to.be.json;
    })
  })
