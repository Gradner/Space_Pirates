///////////////////////////////////////////////////////////////////
//  Imports
///////////////////////////////////////////////////////////////////

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require('express-session')
//var MongoStore = require('connect-mongodb-session')(session);
//var creds = require('./creds.json')
//var passportSocketIo = require('passport.socketio');

///////////////////////////////////////////////////////////////////
//  Initialization
///////////////////////////////////////////////////////////////////

server.listen(5999);
console.log('listening for sockets on port 5999')

//const dbConnString = 'mongodb://' + creds.db.user + ':' + creds.db.pass + '@' + creds.db.url;
//require('./db').connect(dbConnString);

///////////////////////////////////////////////////////////////////
//  Game Management
///////////////////////////////////////////////////////////////////

var GameList = require('./game/GameList');

var games = new GameList({
  
});

var users = [];

///////////////////////////////////////////////////////////////////
//  Routes
///////////////////////////////////////////////////////////////////

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/login');

///////////////////////////////////////////////////////////////////
//  Engine Setup
///////////////////////////////////////////////////////////////////

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////////////////////////////////
//  Socketbois
///////////////////////////////////////////////////////////////////

var loginServ = require('./sockets/loginServ')(io, users, games);
var mmServ = require('./sockets/mmServ')(io, users, games);
var gameServ = require('./sockets/gameServ')(io, games);

// Final Export

module.exports = app;
