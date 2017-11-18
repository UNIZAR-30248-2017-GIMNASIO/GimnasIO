var express = require('express');
var router = express.Router();

var mongoDb = require('../database/mongo');
/**
 * Type: POST
 * Name: gym/newGym
 * Description: Inserts a new Gym in the database and returns its keys.
 * Request:
 *     -Headers: Credentials
 *       -user: string 
 *       -pwd: string
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
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.post('/newGym', function(req, res) {
    var user = req.headers.user;
    var pwd = req.headers.pwd;
    if(!req.body.nameGym || !req.headers.user || !req.headers.pwd){
        res.status(404).send({
            'success': false,
            'message': 'Parámetros incompletos.'
        });
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
                res.status(404).send({
                    'success': false,
                    'message': err
                });
            }
        });
    }
});

/**
 * Type: POST
 * Name: gym/newRoutine
 * Description: Inserts a new Routine in a specified Gym collection.
 * Request:
 *     -Headers: Credentials
 *       -user: string
 *       -pwd: string
 *     -Body: A JSON routine object
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
 *          -A feedback object
 *      400:
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.post('/newRoutine', function(req, res) {
    if(!req.headers.user || !req.headers.pwd) {
        res.status(404).send({
            'success': false,
            'message': "Cabecera de la peticion vacía o incorrecta."
        });
    }
    else{
        if(!req.body.nameGym || !req.body.name || !req.body.objective || !req.body.series || !req.body.rep || !req.body.relaxTime || !req.body.exercises){
            res.status(404).send({
                'success': false,
                'message': "Cuerpo de la peticion vacío o incorrecto."
            });
        }
        else{
            mongoDb.getGymByName(req.headers.user, req.headers.pwd, req.body.nameGym, function(err, result) {
                if(!err){
                    mongoDb.insertRoutine(req.headers.user, req.headers.pwd, req.body.nameGym, req.body.name, req.body.objective, req.body.series, req.body.rep, req.body.relaxTime, req.body.exercises,
                        function(err, result){
                            if(result === 'OK'){
                                res.status(200).send({
                                    'success': true,
                                    'message': "Inserción correcta."
                                });
                            }
                            else res.status(404).send({
                                'success': false,
                                'message': err
                            })
                        });
                }
                else res.status(404).send({
                    'success': false,
                    'message': err
                })
            });
        }
    }
});

module.exports = router;