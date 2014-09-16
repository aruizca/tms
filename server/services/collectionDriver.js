var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
  this.db = db;
};

// returns the whole queried MongoDB collection.
CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

// returns the whole queried MongoDB collection as an array.
CollectionDriver.prototype.findAll = function(collectionName, callback) {
    console.log("in the collection driver findall query...");
    console.log(collectionName);
    this.getCollection(collectionName, function(error, the_collection) {
      if( error ) callback(error);
      else {
        the_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

//Test for particular ID matching
CollectionDriver.prototype.get = function(collectionName, id, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); 
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) {
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    console.log("Object followed by collection name -- in addition of file...")
    console.log(obj);
    console.log(collectionName);
    this.getCollection(collectionName, function(error, the_collection) {
      if( error ) {
	  console.log("Error with collection name...");
	  callback(error);
      }
      else {
	  console.log("Creating new object...");
        obj.created_at = new Date();
	  console.log("Inserting object in collection...");
          the_collection.insert(obj, function() {
	      console.log("Starting callback from insertion...");
              callback(null, obj);
          });
      }
    });
};


exports.CollectionDriver = CollectionDriver;
