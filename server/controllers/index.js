var express = require('express');
var router = express.Router();
var registrationService = require('../services/registrationService');
var fs = require('fs')
//var multiparty = require('multiparty');
var multiparty = require('connect-multiparty');

util = require('util');

var multipartMiddleware = multiparty();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'SMMS: Social Media Monitoring Service' });
});

router.get('/registration', function(req, res) {
    res.render('registration', { title: 'Registration Upload Form' });
});

router.post('/registration/upload', multipartMiddleware, function(req, res) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('receiving upload...');
    res.end(req.files.originalFilename);
    console.log(req.body, req.files);
    console.log(req.files.file.path);
    registrationService.processExcelDocument(req.files.file.path);
    // req.on('end', function (){
    // 	//res.writeHead(200, {'content-type': 'text/plain'});
    // 	res.write('Upload completed. \n\n');
    // });
    
    
    return;

    // var body = '';
    // filePath = __dirname + '/public/data.txt';
    // req.on('data', function(data) {
    //     body += data;
    // 	console.log(data);

    // });

    // req.on('end', function (){
    //     fs.appendFile(filePath, body, function() {
    //     });
    // });

    // TODO Use https://github.com/andrewrk/node-multiparty/ to get the file
    // TODO Send file to registrationService
    // var form = new multiparty.Form();
    
    // form.parse(req, function(err, fields, files) {
    // 	registrationService.processExcelDocument(files[0]);
    // 	res.writeHead(200, {'content-type': 'text/plain'});
    // 	res.write('received upload:\n\n');
    // 	console.log(files[0]);
    // 	res.end(util.inspect({fields: fields, files: files}));
    // });

    return;
});


module.exports = router;
