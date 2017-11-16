var express = require('express');
var router = express.Router();

//var exerciseDb = require('../database/exercise');
var mongoDb = require('../database/mongo');

/**
 * Type: GET
 * Name: /update/
 * Description: Returns the date of the last update.
 * Request:
 *     -Headers: Credentials
 *       -user: string
 *       -pwd: string
 * Responses:
 *      200:
 *          -string
 *      404:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.get('/', function(req, res) {
    if(req.headers.user && req.headers.pwd){
        mongoDb.getLastUpdate(req.headers.user, req.headers.pwd, function (err, result) {
            if(!err){
                var response = {lastUpdate: result[0].lastupdate};
                res.status(200).send(response);
            }
            else res.status(404).send('Empty database. Please contact an administrator.');
        })
    }
    else res.status(404).send("Cuerpo de la peticion vacío o incorrecto.");

});

module.exports = router;