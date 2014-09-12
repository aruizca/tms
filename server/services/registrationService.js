// TODO create method to parse the excel (https://www.npmjs.org/package/excel-parser) and save each row in collection 'registration' in MongoDB

var excelParser = require('excel-parser');


var processExcelDocument = function(document) {
    console.log("Called!");
    excelParser.worksheets({inFile: document}, function(err, worksheets){
	if(err) console.error(err);
	console.log(worksheets);
    });
}

exports.processExcelDocument = processExcelDocument;

