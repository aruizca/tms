var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cfg = require('./app-config');
var debug = require('debug')('smms');

process.title = 'smms';


// DB Connection
// -------------
// Initialize mongofactory
var mongoFactory = require('mongo-factory');

mongoFactory.getConnection(cfg.mongodb.url).then(function(db) {
    debug("MongoDB Connection Pool has been initialized");
    // Initialize MongoDB required indexes if they are not present already
    db.ensureIndex("tweets", {
        "user.screen_name": 1
    }, function(err, indexname) {
        debug('MongoDB Tweets.user.screen_name ready');
    });
    db.ensureIndex("tweets", {
        text: "text"
    }, function(err, indexname) {
        debug('MongoDB Tweets.text Full Text Search Index ready');
    });

});

// Web Application
// ---------------
var app = express();
var server = app.listen( process.env.PORT || 8080, function() {
    debug('Express server listening on port ' + server.address().port);
});

// Hook Socket.io into Express
var io = require('socket.io')(server);

// Controllers/Routes
var routes = require('./server/controllers/index');
var api = require('./server/controllers/api');

// Services
var twitterService = require('./server/services/twitterService');

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
// Jade template engine setup
app.set('view engine', 'jade');

app.use(cors());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') === 'development') {
    app.locals.pretty = true;
}
app.use('/', routes);
app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

// Initialize web-socket related services
twitterService.initTwitterWebSocketServices(app, io);





