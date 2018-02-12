'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
// const expect = chai.expect;

chai.should();

chai.use(chaiHttp);
// it('should exist on Get', function() {
//     return chai.request(app)
//     .get('/')
//     .then (function(res) {
//         expect(res).to.have.status(200);
//     })
// })
describe('index page', function () {
    it('should exist', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          res.should.have.status(200);
        });
    });
  });
