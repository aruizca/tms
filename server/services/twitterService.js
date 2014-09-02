var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');
var twit = new require('twit')
var twitClient = new twit(cfg.twit);
var twitStream;

/**
 * Start up all the twitter socket io listeners
 * @param app Application instance
 * @param io Socket.io instance
 */
var initTwitterTrack = function(app, io) {
    io.sockets.on('connection', function (client) {
        var tweetStreamClient = new tweetStream(cfg['node-tweet-stream']);
        client.on('keywords', function (keywords) {
            // Remove previous keywords filter, if any
            tweetStreamClient._filters.tracking = {};
            // Add new keywords filter
            tweetStreamClient.track(keywords);
            // Reconnect client to Twitter with the new filter
            tweetStreamClient.reconnect();
            // Every time there is a tweet...
            tweetStreamClient.on('tweet', function (tweet) {
                console.log(tweet);
                // We render the tweet in html
                app.render('fragments/tweet', {'tweet': tweet }, function (err, html) {
                    console.log(html);
                    // Sent resulting html to all connected clients
                    client.emit('tweet', {"html": html});
                });
            });
        });

        client.on('track-twitter', function (params) {
            var userNames = params.usernames;
            var keywords = params.keywords;
            var userNamesArray = userNames.split(",");
            // The Twitter API does not allow more than 100
            if (userNamesArray.length > 100) {
                userNamesArray = userNamesArray.slice(0, 100);
            }
            twitClient.post("/users/lookup", {screen_name: userNamesArray.join()}, function(err, data, response) {
                var userIds = [];
                if (data) {
                    // usernames provided
                    data.forEach(function (user) {
                        userIds.push(user.id_str);
                    });
                }
                if (twitStream) {
                    twitStream.stop();
                }
                twitStream = twitClient.stream("statuses/filter", {track: keywords, follow: userIds.join()});
                twitStream.on('tweet', function(tweet) {
                    console.log(tweet);
                    // We render the tweet in html
                    app.render('fragments/tweet', {'tweet': tweet }, function (err, html) {
                        console.log(html);
                        // Sent resulting html to all connected clients
                        client.emit('tweet2', {"html": html});
                    });
                })
            });

        });
    });
};

/**
 *
 * @param username
 * @param numTweets
 * @param callback function(err, data)
 */
var getLastTweetsFromUser = function(username, numTweets, callback) {
    // Strip username from the @ character
    username = username.replace('@', '');

    twitClient.get('/statuses/user_timeline', {
        count: numTweets,
        screen_name: username
    }, function (err, data, response){
        callback(err, JSON.stringify(data));
    });
}

/**
 * Retrieves the list of follows (up to 200) for a given username
 * @param username
 * @param callback
 */
var getFollows = function(username, callback) {
    // Strip username from the @ character
    username = username.replace('@', '');

    twitClient.post('/friends/list', {
        screen_name: username,
        count:200
    }, function (err, data, response){
        callback(err, JSON.stringify(data));
    });
}

exports.initTwitterTrack = initTwitterTrack;
exports.getLastTweetsFromUser = getLastTweetsFromUser;
exports.getFollows = getFollows;
