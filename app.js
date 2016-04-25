var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConnect = require('./control/dbConnect')
var routes = require('./routes/index');
var users = require('./routes/users');
var DAO = require('./DAO');
var passport = require('passport');
var flash = require('connect-flash');
var expressSession = require('express-session');
var busboy = require('connect-busboy');

var app = express();


app.use(expressSession({secret: 'mySecretKey', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//dbConnect.open();
// DAO.uploadPost("TITIES", [{myContent: "hello helo heo", myMeta: "purple"},
//   {myContent: "Goodbye", myMeta: "orange"}]);


// view engine setup

var initPassport = require('./control/passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/up', express.static(__dirname + '/public', { maxAge: 0 }));
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
