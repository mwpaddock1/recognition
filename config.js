
 'use strict';
 exports.PORT = process.env.PORT || 8080;

exports.DATABASE_URL =
 process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://legal:staffer@ds111188.mlab.com:11188/recognitiondb';

exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    'mongodb://testlegal:teststaffer@ds161459.mlab.com:61459/test-recognitiondb';

exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';