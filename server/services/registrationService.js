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
    excelParser.worksheets({inFile: document}, function(err, worksheets){
	if(err) console.error(err);
	console.log(worksheets);
    });

    
    excelParser.parse({inFile: document, 
		       worksheet: 1},
		      function(err, records){
			  firstRow = records[0];
			  if(err) console.error(err);
			  for(var row in records) {
			      //console.log(records[row]);
			      var jsonObj = {}
			      if ( row == 0 ) continue;
			      for(var column in records[row]) {
				  fieldname = records[0][column];
				  console.log(fieldname);
				  jsonObj[fieldname] = records[row][column]
			      }
			      var json_version = JSON.parse(jsonObj);
			      console.log(json_version);
			      db.collection("registration").insert(json_version, function (err) {console.log(err);});
			  }
		      });
}

exports.processExcelDocument = processExcelDocument;

