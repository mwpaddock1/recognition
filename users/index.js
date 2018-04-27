'use strict';
const express = require('express');
const {Employee} = require('./models');
const {Transaction} = require('./models');
const {router} = require('./router');

module.exports = {Employee, Transaction, router};
