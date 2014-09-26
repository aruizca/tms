var express = require('express');
var router = express.Router();
var S = require('string');
var _ = require('underscore');

var twitterService = require('../services/twitterService');
var questionaireService = require('../services/questionaireService');

router.get('/tweets/filter', function (req, res) {
    var filterParams = req.body;
    if (!_.isEmpty(filterParams)) {
        twitterService.filterTweets(filterParams, res, function (tweets, res) {
            res.jsonp(tweets);
        });
    } else {
        res.redirect('/');
    }
});

router.get('/tweets/:screenName', function (req, res) {
    var screenName = req.params.screenName;
    if (screenName) {
        twitterService.getTweetsByScreenName(screenName, res, function (tweets, res) {
            res.jsonp(tweets);
        });
    }
});

router.get('/tweets/number/:screenName', function (req, res) {
    var screenName = req.params.screenName;
    if (screenName) {
        twitterService.getTweetsNumberByScreenName(screenName, res, function (tweetsNumber, res) {
            res.jsonp(tweetsNumber);
        });
    }
});

router.get('/mongodbcollectionquery/:collection', function (req, res) {
    console.log("Starting questionaire service callback.");
    try {
        questionaireService.queryMongoDBCollection(req, res, function (res) {
            console.log("In questionaire service callback.");
        });
    } catch (ex) {
        console.log("Something went wrong in questionaire service callback.");
    }
});

router.post('/mongodbcollectionquery/:collection', function (req, res) {
    var object = req.body;
    var collection = req.params.collection;
    try {
        questionaireService.addFileToCollection(collection, object, res, function (res) {
            console.log("In questionaire service callback.");
        });
    } catch (ex) {
        console.log("Something went wrong in questionaire service callback.");
    }
});

router.get('/mongodbcollectionquery/:collection/:entity', function (req, res) {
    try {
        questionaireService.queryMongoDBCollectionEntity(req, res, function (res) {
            console.log("In questionaire service callback.");
        });
    } catch (ex) {
        console.log("Something went wrong in questionaire service callback.");
    }
});

module.exports = router;
