var express = require('express');
var router = express.Router();

//var exerciseDb = require('../database/exercise');
var mongoDb = require('../database/mongo');

/* GET exercises listing. */
router.get('/', function(req, res, next) {
    //TODO Devolver todos los ejercicios en un JSON
    var respuesta = "xD";
    /*mongoDb.getExercises(function(ress){
        res.send(ress);
    });*/
    mongoDb.getExerciseByName("test", function (err, result) {
        console.log(result);
        res.send(result);
    })
});

module.exports = router;
