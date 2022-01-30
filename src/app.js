const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// View Template Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(cookieParser());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Connection Pool
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  // port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to DB
connection.connect();

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
