const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const puppiesRouter = require('./routes/puppies');
const mastersRouter = require('./routes/masters');
const citiesRouter = require('./routes/cities');

const app = express();

const dbIndexes = require('./queries/db-indexes');

dbIndexes.createPupsIndex();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/puppies', puppiesRouter);
app.use('/api/masters', mastersRouter);
app.use('/api/cities', citiesRouter);

// catch 404 and forward to error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
        .json({
          status: 'error',
          message: err
        });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
      .json({
        status: 'error',
        message: err.message
      });
});

module.exports = app;
