'use strict';
const express = require('express');
const {Employee} = require('./models');
const {Transactions} = require('./models');
const {router} = require('./router');

module.exports = {Employee, Transactions, router};
