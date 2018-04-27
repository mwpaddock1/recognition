 //need these first two for mvp 
 'use strict';
 exports.PORT = process.env.PORT || 8080;
 //the below needed when we switch to the db
exports.DATABASE_URL =
 process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/recognitiondb';

exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/test-recognitiondb';

exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';