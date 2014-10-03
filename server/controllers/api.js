var express = require('express');
var router = express.Router();
var S = require('string');
var _ = require('underscore');

var twitterService = require('../services/twitterService');
var registrationService = require('../services/registrationService');
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

router.get('/attendees/all', function (req, res) {
    registrationService.getAttendeesByScreenName('', res, function(attendees, res) {
        res.jsonp(attendees);
    });
});

router.get('/attendees/pin/:pin', function (req, res) {

});

router.get('/attendees/twitter/:screenName', function (req, res) {

});

router.get('/mongodbcollectionquery/:collection', function (req, res) {
    var collection = req.params.collection;
    var allowedCollections = ['tweets'];
    if (_.indexOf(allowedCollections, collection) != -1) {
        console.log("Starting questionaire service callback.");
        try {
            questionaireService.queryMongoDBCollection(req, res, function (res) {
                console.log("In questionaire service callback.");
            });
        } catch (ex) {
            console.log("Something went wrong in questionaire service callback.");
        }
    } else {
        res.redirect('/');
    }
});

module.exports = router;
