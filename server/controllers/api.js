var express = require('express');
var router = express.Router();
var S = require('string');
var twitterService = require('../services/twitterService');

router.get('/tweets/:screenName', function(req, res){
    var screenName = req.params.screenName;
    if (screenName) {
        twitterService.getTweetsByScreenName(screenName, res, function(tweets, res) {
            res.jsonp(tweets);
        })
    }
});

router.get('/tweets/number/:screenName', function(req, res){
    var screenName = req.params.screenName;
    if (screenName) {
        twitterService.getTweetsNumberByScreenName(screenName, res, function(tweetsNumber, res) {
            res.jsonp(tweetsNumber);
        })
    }
});

module.exports = router;
