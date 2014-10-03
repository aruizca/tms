// TODO create method to parse the excel (https://www.npmjs.org/package/excel-parser) and save each row in collection 'registration' in MongoDB
var cfg = require('../../app-config.json');
var excelParser = require('excel-parser');
var S = require('string');
var _ = require('underscore');

// DB Connection
var mongoFactory = require('mongo-factory');
var db;
mongoFactory.getConnection(cfg.mongodb.url).then(function (dbConnection) {
    db = dbConnection;
});

/**
 *
 * @param document
 * @param res Http Response
 * @param callback
 */
var processExcelDocument = function (document, res, callback) {
    db.collection('registration', function (err, collection) {
        collection.remove({}, function (err, removed) {
            if (err) throw(err);

            db.createCollection('registration', function (err, collection) {
                if (err) throw(err);
                console.log("Completed initializing the registration collection.");

                excelParser.parse({inFile: document, worksheet: 1}, function (err, records) {
                    if (err) throw(err);

                    _.each(records, function(row, index) {
                        if (index > 0) {
                            var jsonObj = {};

                            // PIN
                            jsonObj.pin = row[0];
                            // TWITTER ACCOUNT
                            var screenName = !S(row[10]).isEmpty() ? row[10] : '';
                            if(S(screenName).startsWith('@')) {
                                screenName = S(screenName).chompLeft('@').s;
                            }
                            jsonObj.twitter = screenName;
                            // CIRCLE DATA
                            jsonObj.circleData = [];
                            // First Name
                            jsonObj.circleData.push(_.isString(row[2]) ? row[2].toUpperCase().charCodeAt(0) : 0);
                            // Surname
                            jsonObj.circleData.push(_.isString(row[1]) ? row[1].toUpperCase().charCodeAt(0) : 0);
                            // Interests
                            jsonObj.circleData.push(!S(row[9]).isEmpty() ? row[9].split('|').length : 0);
                            // Age
                            jsonObj.circleData.push(!S(row[7]).isEmpty() && S(row[7]).isNumeric() ? parseInt(row[7]) : 0);
                            // State
                            jsonObj.circleData.push(_.isString(row[4]) ? row[4].toUpperCase().charCodeAt(0) : 0);
                            // Postcode
                            jsonObj.circleData.push(!S(row[5]).isEmpty() && S(row[5]).isNumeric() ? parseInt(row[5]) : 2500);
                            // Pin 1 and 2
                            jsonObj.circleData.push(_.isString(row[0]) && row[0].length == 4 ? parseInt(row[0].substr(0, 2)) : 0);
                            jsonObj.circleData.push(_.isString(row[0]) && row[0].length == 4 ? parseInt(row[0].substr(2, 4)) : 0);

                            db.collection("registration").insert(jsonObj, function () {
                                if (err) throw(err);
                            });
                        }
                    });

                    console.log("Completed loading registration records.");
                    callback(res);
                });
            });
        });
    });
};

var getAttendeesByScreenName = function(screenName, res, callback) {
    if(S(screenName).startsWith('@')) {
        screenName = S(screenName).chompLeft('@').s;
    }

    if (!screenName) {
        db.collection('registration').find().toArray(function (err, attendees) {
            var attendeesWithTweetsCount = [];
            var countTweets = function(attendee) {
                db.collection('tweets').count({'user.screen_name': attendee.twitter}, function(err, count) {
                    attendee.tweetsCount = count;
                    attendeesWithTweetsCount.push(attendee);
                    if (attendees.length == attendeesWithTweetsCount.length) {
                        callback(attendeesWithTweetsCount, res);
                    }
                });
            };
            _.each(attendees, function(attendee, index) {
                countTweets(attendee);
            });
        });
    } else {

    }
};

exports.processExcelDocument = processExcelDocument;
exports.getAttendeesByScreenName = getAttendeesByScreenName;

