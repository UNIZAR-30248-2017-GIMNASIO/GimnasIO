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
 *          -A feedback message
 *      404:
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.get('/', function(req, res) {
    if(req.headers.user && req.headers.pwd){
        mongoDb.getLastUpdate(req.headers.user, req.headers.pwd, function (err, result) {
            if(!err){
                var response = {lastUpdate: result[0].lastupdate};
                res.status(200).send(response);
            }
            else res.status(404).send({
                success: false,
                message: err
            });
        })
    }
    else res.status(404).send({
        success: false,
        message: "Cabecera de la petición vacía o incompleta."
    });

});

module.exports = router;