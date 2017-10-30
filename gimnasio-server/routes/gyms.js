var express = require('express');
var router = express.Router();

var mongoDb = require('../database/mongo');
/**
 * Type: POST
 * Name: gym/newGym
 * Description: Inserts a new Gym in the database and returns its keys.
 * Request:
 *      Body:
 *          -user: string
 *          -pwd: string
 *          -nameGym: string
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
    console.log(req);
    var user = req.body.user;
    var pwd = req.body.pwd;
    mongoDb.insertNewGym(user, pwd, req.body.nameGym);
    var coachKey = 0;
    var userKey = 0;
    mongoDb.getCoachKey(user, pwd, req.body.nameGym, function (err, result) {
        if(!err){
            coachKey = result;
        }
        else res.status(404).send('Error procesando la operación.');
    });
    mongoDb.getUserKey(user, pwd, req.body.nameGym, function (err, result) {
        if(!err){
            userKey = result;
            //Sending the response
            res.status(200).send({
                "userKey": userKey,
                "coachKey": coachKey
            })
        }
        else res.status(404).send('Error procesando la operacion.');
    });

});

/**
 * Type: POST
 * Name: gym/newRoutine
 * Description: Inserts a new Routine in a specified Gym collection.
 * Request:
 *      -user: string
 *      -pwd: string
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
    var user = req.body.user;
    var pwd = req.body.pwd;
    mongoDb.insertRoutine(user, pwd, req.body.nameGym, req.body.name, req.body.objective, req.body.series, req.body.rep,
        req.body.relaxTime, req.body.exercises);
    //TODO comprobar si la insercion es correcta.
    res.status(200).send("Insercion correcta");
});

module.exports = router;