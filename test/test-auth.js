'use strict';
//DATABASE_URL=mongodb://legal:staffer@ds111188.mlab.com:11188/recognitiondb
// global.DATABASE_URL = 'mongodb://localhost/recognitiondb';
const { TEST_DATABASE_URL } = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {
    app,
    runServer,
    closeServer
} = require('../server');
const {
    User
} = require('../users');
const {
    JWT_SECRET
} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function () {
    const username = 'testEmail@john.com';
    const password = 'testPass';
    const firstName = 'testJohn';
    const lastName = 'testDoe';
    const pointsGiven = '';
    const pointsReceived = '';
    const pointsRemaining =''

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName,
                pointsGiven,
                pointsReceived,
                pointsRemaining
            })
        );
    });

    afterEach(function () {
        return User.remove({});
    });

    describe('/login POST endpoint', function () {
        it('Should reject requests with incorrect emailAddresses', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    username: 'wrongEmailAddress',
                    password
                })
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    // console.log(res);
                    expect(res).to.have.status(401);
                });
        });

        it('Should reject requests with incorrect passwords', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({
                    username,
                    password: 'wrongPassword'
                })
                .then(() =>
                    expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(401);
                });
        });

        it('Should return a valid auth token', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username, password })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    const token = res.body.authToken;
                    expect(token).to.be.a('string');
                    const payload = jwt.verify(token, JWT_SECRET, {
                        algorithm: ['HS256']
                    });

                    expect(payload.user).to.deep.equal({
                        id: payload.user.id,
                        username,
                        firstName,
                        lastName,
                        pointsGiven,
                        pointsReceived,
                        pointsRemaining
                    });
                });
        });
    });
});