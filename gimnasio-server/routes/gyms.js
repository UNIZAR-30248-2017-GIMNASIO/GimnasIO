var express = require('express');
var router = express.Router();

var mongoDb = require('../database/mongo');
/**
 * Type: POST
 * Name: gym/newGym
 * Description: Inserts a new Gym in the database and returns its keys.
 * Request:
 *      Body:
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
    console.log(req.headers);
    if(!req.body.nameGym){
        res.status(404).send('Error de inserción, nombre vacío.');
        return 0;
    }
    else{
        mongoDb.insertNewGym(req.body.nameGym, function(err, userKey, coachKey){
            if(err === null){
                res.status(200).send({
                    "userKey": userKey,
                    "coachKey": coachKey
                })
            }
            else{
                res.status(404).send(err);
            }
        });
    }
});

/**
 * Type: POST
 * Name: gym/newRoutine
 * Description: Inserts a new Routine in a specified Gym collection.
 * Request:
 *      -nameGym: string
 *      -name: string
 *      -objective: string
 *      -series: string
 *      -rep: int
 *      -relaxTime: int
 *      -exercises: [string]
 * Responses:
 *      200:
 *          -A feedback message
 *      400:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.post('/newRoutine', function(req, res, next) {
    if(req.body){
        mongoDb.insertRoutine(req.body.nameGym, req.body.name, req.body.objective, req.body.series, req.body.rep, req.body.relaxTime, req.body.exercises, function(err){
            if(err === 'OK'){
                res.status(200).send("Inserción correcta.");
            }
            else res.status(404).send("Error de inserción. Comprueba los parametros.");
        });
    }
    else res.status(404).send("Cuerpo de la petición vacío.");
});

module.exports = router;