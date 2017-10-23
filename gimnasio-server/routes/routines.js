var express = require('express');
var router = express.Router();

/**
 * Type: GET
 * Name: routines/
 * Description: Returns a JSON containing every routine on the Database
 * for a given Gym access key.
 * Request:
 *      -key: string
 * Responses:
 *      200:
 *          -JSON object containing multiple routine objects:
 *              -nameGym: string
 *              -name: string
 *              -objective: string
 *              -series: int
 *              -rep: int
 *              -relaxTime: int
 *      404:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.get('/', function(req, res, next) {
    //TODO Devolver las rutinas de un gym dada la clave
    res.send('rutinas');
});

module.exports = router;