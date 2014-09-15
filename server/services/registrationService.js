// TODO create method to parse the excel (https://www.npmjs.org/package/excel-parser) and save each row in collection 'registration' in MongoDB
var cfg = require('../../app-config.json');
var excelParser = require('excel-parser');


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

                    for (var row in records) {
                        var jsonObj = {};
                        if (row == 0) continue;
                        for (var column in records[row]) {
                            fieldname = records[0][column].trim();

                            if (records[row][column].indexOf("|") >= 0) {
                                var result = records[row][column].split('|');
                                jsonObj[fieldname] = result;
                            } else {
                                jsonObj[fieldname] = records[row][column]
                            }
                        }

                        db.collection("registration").insert(jsonObj, function () {
                            if (err) throw(err);
                        });
                    }

                    console.log("Completed loading registration records.");
                    callback(res);
                });
            });
        });
    });
};

exports.processExcelDocument = processExcelDocument;

