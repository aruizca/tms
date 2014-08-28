var express = require('express');
var twit = require('twit');
var router = express.Router();


var twitClient = new twit({
    consumer_key:         'SM5YN0yVagCqscImfalG1UiBq'
    , consumer_secret:      'LBlavUGoXGKQPCXuuXYvuspoAtr2WfQcKjcK14mgc88oDSRLK9'
    , access_token:         '42127167-As4tYHEwpSU2t2T2TTs1N4s2TIbPIXIrwd6iwLPbR'
    , access_token_secret:  'fQiAM7rkKGlVf61l8EmUOlTr0FYpEBQmMszGaX3RbY5CX'
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/last-10-tweets', function(req, res){
    twitClient.get('/statuses/user_timeline', {
        count: 10,
        user_id: 42127167,
        screen_name: 'aruizca'
    }, function (err, data, response){
        res.write(JSON.stringify(data));
        res.end();
    });
});


module.exports = router;
