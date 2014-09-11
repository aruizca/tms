var express = require('express');
var router = express.Router();
var registrationService = require('../services/registrationService');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'SMMS: Social Media Monitoring Service' });
});

router.get('/registration', function(req, res) {
    res.render('registration', { title: 'Registration Upload Form' });
});

router.post('/registration/upload', function(req, res) {
    // TODO Use https://github.com/andrewrk/node-multiparty/ to get the file
    // TODO Send file to registrationService
});


module.exports = router;
