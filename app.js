var setupApp = require('./setup').setupApplication();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var routes = require('./routes/index');

var app_manager = require('./routes/app/router-app-manager'),
    user = require('./routes/user/router-user'),
    farmer = require('./routes/resources/farmer/router-farmer'),
    platform = require('./routes/platform/router-platform');

var app = express();

var model = require('./models/db');

var User = model.User,
    App = model.App,
    Role = model.Role;//these are used in the new ACL middleware I have defined in this file to be used before API endpoints

/**
 * This is probably not necessary - but it establishes a connection
 * with the DB on first startup and prints out the tables
 */
var test_resources = require('./models/resources-db');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var app_manager = require('./routes/app/router-app-manager'),
    user = require('./routes/user/router-user'),
    farmer = require('./routes/resources/farmer/router-farmer');

var aclMiddleware = function (req, res, next) {//this function gets the role name of the application whose access token was used in the API request
        App.findOne({ap_app_token: req.query.access_token}, function (err, app) {
            if (err) {
                next(err);
            } else {
                if (app !== null) Role.findOne({_id: app.ap_app_role}).exec(function (err, role) {
                    if (err) {
                        next(err);
                    } else {
                        //fakeblock
                        req.app_role_name = role.ro_role_name;//adds the role name to the request object
                        next();
                    }
                })
                else res.send("Invalid token or no token supplied.");
            }
        })
}

app.use('/api', aclMiddleware);

app.use('/', routes);
app.use('/', app_manager);
app.use('/', user);
app.use('/', platform);
app.use('/api', farmer);

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
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;