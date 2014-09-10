var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');
var render = require('render');
var handlebars = require("handlebars");
var fs = require("fs");
var path = require('path');


var template = fs.readFileSync('server/templates/tweetRedux.hbs', "utf8");
var jsonBuilder = handlebars.compile(template);

/**
 * Start up all the twitter socket io listeners
 * @param app Application instance
 * @param io Socket.io instance
 */
var initTwitterWebSocketServices = function(app, io) {
    io.sockets.on('connection', function (socket) {
        var tweetStreamClient = new tweetStream(cfg['node-tweet-stream']);
        socket.on('client:start', function (keywords) {
            // Remove previous keywords filter, if any
            tweetStreamClient._filters.tracking = {};
            // Add new keywords filter
            tweetStreamClient.track(keywords);
            // Reconnect client to Twitter with the new filter
            tweetStreamClient.reconnect();
            // Every time there is a tweet...
            tweetStreamClient.on('tweet', function (tweet) {

                // Store the tweet in the DB
                // TODO

                // Generate redux json
                var tweetRedux = JSON.parse(jsonBuilder(tweet));
                if (app.get('env') === 'development') {
                    console.log(jsonBuilder(tweet));
                }

                // Sent resulting html to all connected clients
                socket.emit('server:tweet', tweetRedux);

            });
        });
    });
};

exports.initTwitterWebSocketServices = initTwitterWebSocketServices;

