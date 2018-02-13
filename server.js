
'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));
// app.use(morgan(':date[iso] :method :url :response-time'));

app.use(express.static('public'));

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;