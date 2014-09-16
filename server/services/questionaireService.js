var cfg = require('../../app-config.json');
var debug = require('debug')('smms');

var mongoFactory = require('mongo-factory');
var db;

CollectionDriver = require('./collectionDriver').CollectionDriver;

var collectionDriver;

mongoFactory.getConnection(cfg.mongodb.url).then(function (dbConnection) {
    db = dbConnection;
    collectionDriver = new CollectionDriver(db);
});

/**
 *
 * @param MongoDB collection 
 * @param object 
 * @param res Http Response
 * @param callback
 */
var addFileToCollection = function (collection, object, res, callback) {
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) {  console.log("File addition appears to have failed..."); res.send(400, err); callback(res);} 
          else { console.log("File addition appears to have worked..."); res.send(201, docs);  callback(res);}
     });
}

/**
 *
 * @param MongoDB collection query
 * @param res Http Response
 * @param callback
 */
var queryMongoDBCollectionEntity = function (query, res, callback) {
    
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
    if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) {
          if (error) { res.send(400, error); callback(res);}
          else { res.send(200, objs); callback(res);}
       });
   } else {
       res.send(400, {error: 'bad url', url: req.url}); 
       callback(res);
   }
}

/**
 *
 * @param MongoDB collection query
 * @param res Http Response
 * @param callback
 */
var queryMongoDBCollection = function (query, res, callback) {
    console.log("about to query database...");
    console.log(query.params.collection);
    var params = query.params;
    collectionDriver.findAll(query.params.collection, function(error, objs) { 
	console.log("queried database...");
    	if (error) { 
	    console.log("and we got an error...");
            debug(query);
	    res.send(400, error);callback(res); }
	else { 
	    console.log("and it seems to have worked...");
            debug(query);
	    if (query.accepts('html')) {
		console.log("ready to return an HTML request...");
		debug(query);
    	        res.render('data',{objects: objs, collection: query.params.collection});
		callback(res);
            } else {
		console.log("ready to return an JASON request...");
		debug(query);
	        res.set('Content-Type','application/json');
                res.send(200, objs);
		callback(res);
            }
        }
    });
};

exports.queryMongoDBCollection = queryMongoDBCollection;
exports.queryMongoDBCollectionEntity = queryMongoDBCollectionEntity;
exports.addFileToCollection = addFileToCollection;
