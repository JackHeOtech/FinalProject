require('dotenv').config();

var express = require('express');
var path = require('path'); 
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var surveysRouter = require('./routes/surveys');

const session = require('express-session');
const passport = require('./config/passport'); //Configure the passport library in app.js
const flash = require('connect-flash');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.title = 'Our Survey Site';
  res.locals.user = req.user || null;
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/surveys', surveysRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const mongoose = require('./config/db');

module.exports = app;
