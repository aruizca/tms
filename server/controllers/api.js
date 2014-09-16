var express = require('express');
var router = express.Router();
var S = require('string');
var twitterService = require('../services/twitterService');

router.get('/tweets/by-pin/:userId', function(req, res){
    var userId = req.params.userId;
    if (userId) {
        // TODO
    }
});

router.get('/tweets/by-screen-name/:screenName', function(req, res){
    var screenName = req.params.screenName;
    if (screenName) {
        twitterService.getTweetsByScreenName(screenName, res, function(tweets, res) {
            res.jsonp(tweets);
        })
    }
});

router.get('/tweets/anonymous', function(req, res){
        // TODO

});

module.exports = router;
