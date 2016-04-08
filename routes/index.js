var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { pageName: 'Open Records', pageDescription: 'Login' });
});

router.get('/upload', function(req, res, next) {


  res.render('upload', { pageName: 'Open Records', pageDescription: 'Login' });
});

router.get('/stats', function(req, res, next) {


  res.render('stats', { pageName: 'Open Records', pageDescription: 'Stats' });
});

router.get('/piracy', function(req, res, next) {


  res.render('piracy', { pageName: 'Open Records', pageDescription: 'Piracy' });
});


module.exports = router;
