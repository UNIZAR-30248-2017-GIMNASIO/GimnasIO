var express = require('express');
var router = express.Router();

//var exerciseDb = require('../database/exercise');
var mongoDb = require('../database/mongo');

/**
 * Type: GET
 * Name: /exercises/
 * Description: Returns a JSON containing every exercise on the Database.
 * Request: -
 * Responses:
 *      200:
 *          -JSON object containing multiple exercise objects:
 *              -id: string
 *              -name: string
 *              -muscle: string
 *              -description: string
 *              -images: [string]
 *              -tag: string
 *      404:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.get('/', function(req, res, next) {
    mongoDb.getExercises(function (err, result) {
        console.log("error: " + err);
        console.log("result: " + result);
        res.send(result);
    })
});

module.exports = router;
