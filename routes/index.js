var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('index', { pageName: 'Open Records', pageDescription: 'Login' });
});




module.exports = router;
