
// 'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));
// app.use(morgan(':date[iso] :method :url :response-time'));

app.use(express.static('public'));
const bodyParser = require ('body-parser');
const jsonParser = bodyParser.json();
const {employeeList} = require ('./models');

employeeList.create('demo1', 'josey', 'josey@fizzbuzz.com');
employeeList.create('example', 'mary', 'mary@fizzbuzz.com');

app.get('/employee-list', (req, res) => {
res.json(employeeList.get());
});

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;