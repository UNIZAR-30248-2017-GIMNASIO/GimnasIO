var express = require('express');
var router = express.Router();

var exerciseDb = require('../database/exercise');

/* GET exercises listing. */
router.get('/', function(req, res, next) {
    //TODO Devolver todos los ejercicios en un JSON
    //exerciseDb.getExercises();
    res.send('ejercicios');
});

module.exports = router;
