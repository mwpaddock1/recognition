'use strict';
//DATABASE_URL=mongodb://legal:staffer@ds111188.mlab.com:11188/recognitiondb
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    Employee
} = require('../users');
const {
    JWT_SECRET,
    TEST_DATABASE_URL,
    PORT
} = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Auth endpoints', function () {
    const emailAddress = 'testEmail@joe.com';
    const password = 'testPass';
    const firstName = 'testJohn';
    const lastName = 'testDoe';

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return Employee.hashPassword(password).then(password =>
            Employee.create({
                emailAddress,
                password,
                firstName,
                lastName
            })
        );
    });

    afterEach(function () {
        return Employee.remove({});
    });

    describe('/login POST endpoint', function () {
        it('Should reject requests with incorrect emailAddresses', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                // .send({
                //     'emailAddress': emailAddress,
                //     'password': password
                // })
                .send({
                    emailAddress: emailAddress,
                    password: password,
                })
                // .then(() =>
                //     expect.fail(null, null, 'Request should not succeed')
                // )
                .then((res) => {
                    expect(res).to.have.status(401);
                  })
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                    // const res = err.response;
                    // expect(res).to.have.status(401);
                });
        });
        // it('Should reject requests with incorrect passwords', function () {
        //     return chai
        //         .request(app)
        //         .post('/api/auth/login')
        //         .send({
        //             emailAddress: emailAddress,
        //             password: password
        //         })
        //         then((res) => {
        //             expect(res).to.have.status(401);
        //           })
        //         // .then(() =>
        //         //     expect.fail(null, null, 'Request should not succeed')
        //         // )
        //         .catch(err => {
        //             if (err instanceof chai.AssertionError) {
        //                 throw err;
        //             }

        //             // const res = err.response;
        //             // expect(res).to.have.status(401);
        //         });
        // });
        // it('Should return a valid auth token', function () {
        //     return chai
        //         .request(app)
        //         .post('/api/auth/login')
        //         .send({
        //             emailAddress,
        //             password
        //         })
        //         .then(res => {
        //             expect(res).to.have.status(200);
        //             expect(res.body).to.be.an('object');
        //             const token = res.body.authToken;
        //             expect(token).to.be.a('string');
        //             const payload = jwt.verify(token, JWT_SECRET, {
        //                 algorithm: ['HS256']
        //             });
        //             expect(payload.employee).to.deep.equal({
        //                 emailAddress,
        //                 firstName,
        //                 lastName
        //             });
        //         });
        // });
    });


});