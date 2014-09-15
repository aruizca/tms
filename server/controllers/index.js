var express = require('express');
var router = express.Router();
var registrationService = require('../services/registrationService');
var multiparty = require('multiparty');
var S = require('string');
var debug = require('debug')('smms');

util = require('util');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'SMMS: Social Media Monitoring Service' });
});

router.get('/registration', function(req, res) {
    res.render('registration', { title: 'Registration Upload Form' });
});

router.post('/registration/upload', function(req, res) {

    var form = new multiparty.Form();

    form.on('file', function(name, file) {
        try {
            if (S(file.originalFilename).endsWith('.xlsx')) {
                console.log("Processing document " + file.originalFilename);
                registrationService.processExcelDocument(file.path, res, function (res) {
                    res.redirect("/registration?result=1");
                });
            } else {
                res.redirect("/registration?result=2");
            }
        } catch (ex) {
            debug(ex);
            res.redirect("/registration?result=3");
        }
    });

    form.on('error', function(err){
        res.redirect("/registration?result=3");
    });

    form.parse(req);

});

module.exports = router;
