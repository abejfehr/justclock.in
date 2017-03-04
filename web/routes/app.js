var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('app/index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('app/login', { title: 'Express' });
});

module.exports = router;
