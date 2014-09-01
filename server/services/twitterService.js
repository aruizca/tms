var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');
var twit = new require('twit')
var twitClient = new twit(cfg.twit);

var initTwitterTrack = function(app, io) {
    io.sockets.on('connection', function (client) {
        var tweetStreamClient = new tweetStream(cfg['node-tweet-stream']);
        client.on('keywords', function (keywords) {
            tweetStreamClient.track(keywords);
            tweetStreamClient.on('tweet', function (realTweet) {
                console.log(realTweet);
                // We render the tweet in html
                app.render('fragments/tweet', {'tweet': realTweet }, function (err, html) {
                    console.log(html);
                    // Sent resulting html to all connected clients
                    client.emit('tweet', {"html": html});
                });
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

exports.initTwitterTrack = initTwitterTrack;
exports.getLastTweetsFromUser = getLastTweetsFromUser;
