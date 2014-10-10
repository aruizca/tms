// TODO create method to parse the excel (https://www.npmjs.org/package/excel-parser) and save each row in collection 'registration' in MongoDB
var cfg = require('../../app-config.json');
var excelParser = require('excel-parser');
var S = require('string');
var _ = require('underscore');
var async = require('async');

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
            // Asynchronous and parallel loop over each attendee
            async.each(attendees, function(attendee, done) {
                // Grab count
                db.collection('tweets').count({'user.screen_name': attendee.twitter}, function(err, count) {
                    // Apply count to attendee object and call sub-callback
                    attendee.tweetsCount = count;
                    done();
                });
            }, function() {
                // async loop done!
                callback(attendees, res);
            });

        });
    } else {

    }
};

exports.processExcelDocument = processExcelDocument;
exports.getAttendeesByScreenName = getAttendeesByScreenName;

