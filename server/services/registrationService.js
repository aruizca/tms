// TODO create method to parse the excel (https://www.npmjs.org/package/excel-parser) and save each row in collection 'registration' in MongoDB
var cfg = require('../../app-config.json');
var excelParser = require('excel-parser');


// DB Connection
var mongoFactory = require('mongo-factory');
var db;
mongoFactory.getConnection(cfg.mongodb.url).then(function(dbConnection) {
    db = dbConnection;
});

var processExcelDocument = function(document) {
    console.log("Called!");
    excelParser.worksheets({inFile: document}, function(err, worksheets){
	if(err) console.error(err);
	console.log(worksheets);
    });

    
    excelParser.parse({inFile: document, 
		       worksheet: 1,
		       skipEmpty: true},
		      function(err, records){
			  if(err) console.error(err);
			  for(var entry in records) {
			      var json_version = JSON.stringify(records[entry])
			      console.log(json_version);
			  }
			  
			  
		      });
}

exports.processExcelDocument = processExcelDocument;

