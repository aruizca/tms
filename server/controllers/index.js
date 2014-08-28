var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/tracker', function(req, res) {
    res.render('tracker', { title: 'Tracker' });
});

module.exports = router;
