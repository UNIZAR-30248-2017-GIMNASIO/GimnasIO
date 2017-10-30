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
router.post('/newGym', function(req, res) {
    var user = req.body.user;
    var pwd = req.body.pwd;
    if(!req.body.nameGym || !req.body.user || !req.body.pwd){
        res.status(404).send('Parámetros incompletos.');
        return 0;
    }
    else{
        mongoDb.insertNewGym(user, pwd, req.body.nameGym, function(err, userKey, coachKey){
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
 *      -user: string
 *      -pwd: string
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
router.post('/newRoutine', function(req, res) {
    if(req.body.user && req.body.pwd && req.body.nameGym && req.body.name && req.body.objective && req.body.series && req.body.rep && req.body.relaxTime && req.body.exercises){
        mongoDb.insertRoutine(req.body.user, req.body.pwd, req.body.nameGym, req.body.name, req.body.objective, req.body.series, req.body.rep, req.body.relaxTime, req.body.exercises,
            function(err){
            if(err === 'OK'){
                res.status(200).send("Inserción correcta.");
            }
            else res.status(404).send("Error de inserción. Comprueba los parametros.");
        });
    }
    else res.status(404).send("Cuerpo de la petición vacío o incompleto.");
});

module.exports = router;