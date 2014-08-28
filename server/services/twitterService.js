var tweetStream = require('node-tweet-stream');
var cfg = require('../../app-config.json');

var initTwitterTrack = function(app, io) {
   var tweetStreamClient = new tweetStream(cfg['node-tweet-stream']);
    // We monitor twitter for the
    tweetStreamClient.track('nicta,infrahack,#TECHShowcase');
    tweetStreamClient.on('tweet', function(realTweet){
        console.log(realTweet);
        // We render the tweet in html
        app.render('fragments/tweet', {'tweet': realTweet }, function(err, html) {
            console.log(html);
            // Sent resulting html to all connected clients
            io.emit('tweet', {"html": html});
        });
    });
};



exports.initTwitterTrack = initTwitterTrack;
