'use strict';
const {router} = require('./router');
const {localStrategy, jwtStrategy} = require('./strategies');

module.exports = {router, localStrategy, jwtStrategy};

//from slack:
   // xhr.setRequestHeader('Authorization', ('BEARER '+ data.authToken)); 