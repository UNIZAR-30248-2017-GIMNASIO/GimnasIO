var express = require('express');
var router = express.Router();

/**
 * Type: POST
 * Name: gym/newGym
 * Description: Inserts a new Gym in the database and returns its keys.
 * Request:
 *      -nameGym: string
 * Responses:
 *      200:
 *          -JSON object containing access keys:
 *              -userKey: string
 *              -coachKey: string
 *      400:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.post('/newGym', function(req, res, next) {
    //TODO Insertar un gym y devolver las claves en un JSON
    res.send('claves gym');
});

/**
 * Type: POST
 * Name: gym/newRoutine
 * Description: Inserts a new Routine in a specified Gym collection.
 * Request:
 *      -nameGym: string
 * Responses:
 *      200:
 *          -A feedback message
 *      400:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.post('/newRoutine', function(req, res, next) {
    //TODO Insertar una rutina asociada a un gym
    res.send('rutina insertada');
});

module.exports = router;