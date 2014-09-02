var express = require('express');
var router = express.Router();
var twitterService = require('../services/twitterService');

router.get('/last-tweets/:username/:numTweets', function(req, res){
    var username = req.params.username ? req.params.username : '';
    var numTweets = req.params.numTweets ? req.params.numTweets : 10;
    twitterService.getLastTweetsFromUser(username, numTweets, function(err, data) {
        res.end(data);
    });
});

router.get('/follows/:username', function(req, res){
    var username = req.params.username ? req.params.username : '';
    twitterService.getFollows(username, function(err, data) {
        res.end(data);
    });
});

module.exports = router;
