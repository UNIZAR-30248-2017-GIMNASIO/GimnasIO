var express = require('express');
var router = express.Router();

//var exerciseDb = require('../database/exercise');
var mongoDb = require('../database/mongo');

router.get('/', function(req, res) {
    if(req.headers.u && req.headers.p){
        mongoDb.getLastUpdate(req.headers.u, req.headers.p, function (err, result) {
            if(!err){
                res.status(200).send(result);
            }
            else res.status(404).send('Empty database. Please contact an administrator.');
        })
    }
    else res.status(404).send("Cuerpo de la peticion vacío o incorrecto.");

});

module.exports = router;