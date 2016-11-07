
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var winston = require('winston');

var expressSession=require('express-session');

//url for session collection
var mongoSessionConnectURL = "mongodb://localhost:27017/login";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var indexR=require('./routes/index');
var login=require('./routes/login');
var home1=require('./routes/home1');
var home=require('./routes/home');



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//mongo session

app.use(expressSession({
  secret: 'sreekarMongo',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false,	// don't create session until something stored
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  store: new mongoStore({
  url: mongoSessionConnectURL
})
})
);


// adding winston

var logger1 = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename:
    'logs/logs.log' })
  ]
});


logger1.log('info', 'Rabbit mq client started right now !');



// get calls
app.get('/',indexR.index);
app.get('/gethomepage',home.redirectHomepage);
//app.get('/loadhomepage',home.fetchHomepageData);
app.get('/loadhomepage',home1.loadHomePage);
app.get('/logout',home.logoutUser);

//post calls
app.post('/checkSignin',home1.checkSignin);
app.post('/userregistration',home1.newUserSignup);







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
