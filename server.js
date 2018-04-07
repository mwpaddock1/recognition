
// 'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   next();
// });

app.use(express.static('public'));
const bodyParser = require ('body-parser');
const jsonParser = bodyParser.json();
const {employeeList} = require ('./models');

employeeList.create('demo1', 'josephine', 'josey@fizzbuzz.com');
employeeList.create('example', 'mary', 'mary@fizzbuzz.com');

app.get('/employee-list', (req, res) => {
res.json(employeeList.get());
});


// app.post();
//app.put();
//app.delete();
if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}
//environment variable called PORT - it's value is set outside of this app
module.exports = app;