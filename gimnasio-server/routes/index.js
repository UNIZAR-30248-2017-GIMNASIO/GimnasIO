var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET registro page. */
router.get('/registrate', function(req, res, next) {
  res.render('registro');
});

/* GET tarifas page. */
router.get('/tarifas', function(req, res, next) {
    res.render('tarifas');
});

/* GET acerca de page. */
router.get('/acercade', function(req, res, next) {
    res.render('acercade');
});
module.exports = router;
