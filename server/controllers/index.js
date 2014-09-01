var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'SMMS: Social Media Monitoring Service' });
});

router.get('/rest-api-example', function(req, res) {
    res.render('rest-api-example', { title: 'REST API example' });
});

router.get('/streaming-api-example', function(req, res) {
    res.render('streaming-api-example', { title: 'STREAMING API example' });
});

router.get('/tracker', function(req, res) {
    res.render('tracker', { title: 'Tracker' });
});

module.exports = router;
