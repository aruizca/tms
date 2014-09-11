var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');
var render = require('render');
var handlebars = require("handlebars");
var fs = require("fs");
var path = require('path');
var debug = require('debug')('smms');

// Reduced templates
var tweetReduxTemplate = fs.readFileSync('server/templates/tweetRedux.hbs', "utf8");
var tweetJsonBuilder = handlebars.compile(tweetReduxTemplate);

// Real Time tracking Status
var status = {
    running: false,
    keywords: ''
};

// DB Connection
var mongoFactory = require('mongo-factory');
var db;
mongoFactory.getConnection(cfg.mongodb.url).then(function(dbConnection) {
    db = dbConnection;
});

/**
 * Start up all the twitter socket io listeners
 * @param app Application instance
 * @param io Socket.io instance
 */
var initTwitterWebSocketServices = function(app, io) {
    io.on('connection', function (socket) {
        var tweetStreamClient = new tweetStream(cfg['node-tweet-stream']);

        // "client:start" event handling
        socket.on('client:start', function (keywords) {
            // Status management
            status.running = true;
            status.keywords = keywords;
            io.emit('server:status-update', status);
            // Remove previous keywords filter, if any
            tweetStreamClient._filters.tracking = {};
            // Add new keywords filter
            tweetStreamClient.track(keywords);
            // Reconnect client to Twitter with the new filter
            tweetStreamClient.reconnect();
            // Every time there is a tweet...
            tweetStreamClient.on('tweet', function (tweet) {
                try {
                    // Store the tweet in the DB
                    db.collection("tweets").insert(tweet, function (err) {

                        // Generate redux json
                        var tweetRedux = tweetJsonBuilder(tweet);
                        if (app.get('env') === 'development') {
                            console.log(tweetRedux);
                        }

                        // Send resulting html to all connected clients
                        if (status.running) {
                            io.emit('server:tweet', JSON.stringify(tweetRedux));
                        }
                    });
                } catch (e) {
                    debug(e);
                }
            });
        });

        // "client:stop" event handling
        socket.on('client:stop', function () {
            // Status management
            status.running = false;
            io.emit('server:status-update', status);
        });

        // "client:stop" event handling
        socket.on('client:status-report', function () {
            io.emit('server:status-update', status);
        });
    });
};

exports.initTwitterWebSocketServices = initTwitterWebSocketServices;

