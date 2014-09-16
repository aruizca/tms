var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');
var render = require('render');
var handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('smms');
var _ = require('underscore');
var S = require('string');

// Reduced templates
var tweetReduxTemplate = fs.readFileSync('server/templates/tweetRedux.hbs', 'utf8');
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

        // 'client:start' event handling
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
                    db.collection('tweets').insert(tweet, function (err) {

                        // Generate redux json
                        var tweetRedux = tweetJsonBuilder(cleanTweetText(tweet));
                        if (app.get('env') === 'development') {
                            console.log(tweetRedux);
                        }

                        // Send resulting html to all connected clients
                        if (status.running) {
                            try {
                                io.emit('server:tweet', JSON.parse(tweetRedux));
                            } catch (ex) {
                                debug(ex);
                            }
                        }
                    });
                } catch (e) {
                    debug(e);
                }
            });
        });

        // 'client:stop' event handling
        socket.on('client:stop', function () {
            // Status management
            status.running = false;
            io.emit('server:status-update', status);
        });

        // 'client:stop' event handling
        socket.on('client:status-report', function () {
            io.emit('server:status-update', status);
        });
    });
};

/**
 *
 * @param screenName
 * @param res
 * @param callback
 */
var getTweetsByScreenName = function(screenName, res, callback) {

    if(S(screenName).startsWith('@')) {
        screenName = S(screenName).chompLeft('@').s;
    }

    db.collection('tweets').find({'user.screen_name': screenName}).toArray(function(err, tweets) {
        if (err) throw err;
        callback(_.map(tweets, function(tweet) {
            try {
                return JSON.parse(tweetJsonBuilder(cleanTweetText(tweet)));
            } catch (ex) {
                debug(ex);
            }
        }), res);
    });
};

/**
 *
 * @param screenName
 * @param res
 * @param callback
 */
var getTweetsNumberByScreenName = function(screenName, res, callback) {
    if(S(screenName).startsWith('@')) {
        screenName = S(screenName).chompLeft('@').s;
    }

    db.collection('tweets').count({'user.screen_name': screenName}, function(err, count) {
        if (err) throw err;
        callback({"count": count}, res);
    });

};

/**
 * This is to prevent weird twiits with carrier return from breaking
 * When you apply JSON stringify to a single String it surrounds the string with quotes that need to be removed.
 * @param tweet
 * @returns {tweet}
 */
var cleanTweetText = function (tweet) {
    tweet.text = S(JSON.stringify(tweet.text.replace("\"", ''))).chompLeft("\"").chompRight("\"").s;
    if (tweet.retweeted_status) {
        tweet.retweeted_status.text = S(JSON.stringify(tweet.retweeted_status.text)).chompLeft("\"").chompRight("\"").s;
    }
    return tweet;
};

exports.initTwitterWebSocketServices = initTwitterWebSocketServices;
exports.getTweetsByScreenName = getTweetsByScreenName;
exports.getTweetsNumberByScreenName = getTweetsNumberByScreenName;

