var express = require('express');
var router = express.Router();

var mongoDb = require('../database/mongo');
/**
 * Type: GET
 * Name: routines/
 * Description: Returns a JSON containing every routine on the Database
 * for a given Gym access key.
 * Request:
 *      -nameGym: string
 *      -key: string
 *      -user: string
 *      -pwd: string
 * Responses:
 *      200:
 *          -JSON object containing multiple routine objects:
 *              -name: string
 *              -objective: string
 *              -relaxTime: int
 *              -exercises: [string]
 *      404:
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.get('/', function(req, res) {
    var userKey = 0;
    var coachKey = 0;
    if(!req.headers.user || !req.headers.pwd || !req.headers.namegym || !req.headers.key){
        res.status(404).send({
            'success': false,
            'message': 'Cabecera de la peticion vacía o incorrecta.'
        })
    }else {
        mongoDb.getUserKey(req.headers.user, req.headers.pwd, req.headers.namegym, function(err, result){
            if(!err){
                userKey = result;
                console.log("userkey: "+userKey);
                mongoDb.getCoachKey(req.headers.user, req.headers.pwd, req.headers.namegym, function (err2, result2){
                    if(!err2){
                        coachKey = result2;
                        console.log("coachkey: " + coachKey);
                        // If given key is a valid user or coach key for that gym
                        if(req.headers.key === userKey || req.headers.key === coachKey){
                            mongoDb.getRoutinesOfAGym(req.headers.user, req.headers.pwd, req.headers.namegym, function (err, result) {
                                if(!err){
                                    var jsonres = {};
                                    for(var i=0; i < result.length; i++) {
                                        jsonres[i] = result[i];
                                    }
                                    console.log("relaxtime:" + jsonres);
                                    res.status(200).send(jsonres);
                                }
                                else res.status(404).send({
                                    'success': false,
                                    'message': err
                                });
                            })
                        }
                        else{
                            res.status(404).send({
                                'success': false,
                                'message': 'Clave del gimnasio incorrecta o inválida.'
                            });
                        }
                    }
                    else{ //Error means the gym is not on the database, therefore we cannot continue.
                        res.status(404).send({
                            'success': false,
                            'message': 'Gimnasio no registrado.'
                        });
                    }
                });
            }
            else{ //Error means the gym is not on the database, therefore we cannot continue.
                res.status(404).send({
                    'success': false,
                    'message': err
                });
                return 0;
            }
        });


    }
});

/**
 * Type: POST
 * Name: routines/newRoutine
 * Description: Inserts a new Routine in a specified Gym collection.
 * Request:
 *     -Headers: Credentials
 *       -user: string
 *       -pwd: string
 *       -nameGym: string
 *       -key: string
 *     -Body: A JSON routine object
 *      -name: string
 *      -objective: string
 *      -exercises: [string]
 *      -repetitions: [int]
 *      -series: [int]
 *      -relaxTime: [double]
 * Responses:
 *      200:
 *          -A feedback object
 *      400:
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.post('/newRoutine', function(req, res) {
    if(!req.headers.user || !req.headers.pwd || !req.headers.namegym || !req.headers.key) {
        res.status(404).send({
            'success': false,
            'message': "Cabecera de la petición vacía o incorrecta."
        });
    }
    else{
        if(!req.body.name || !req.body.objective || !req.body.relaxTime || !req.body.exercises
        || !req.body.repetitions || !req.body.series){
            res.status(404).send({
                'success': false,
                'message': "Cuerpo de la peticion vacío o incorrecto."
            });
        }
        else{
            mongoDb.getKeys(req.headers.user, req.headers.pwd, req.headers.namegym, function(err, userKey, coachKey){
                if(err) {
                    res.status(404).send({
                        'success': false,
                        'message': err
                    });
                } else if (req.headers.key === userKey) {
                    res.status(404).send({
                        'success': false,
                        'message': "Permisos insuficientes."
                    });
                } else{
                    if(req.headers.key === coachKey) {
                        mongoDb.getGymByName(req.headers.user, req.headers.pwd, req.headers.namegym,
                            function(err, result) {
                            if(!err){
                                var exercisesArray = {};
                                for(var i = 0; i < req.body.exercises.length; i++) {
                                    exercisesArray[i] = {
                                        name: req.body.exercises[i],
                                        repetitions: req.body.repetitions[i],
                                        series: req.body.series[i],
                                        relaxTime: req.body.relaxTime[i]
                                    }
                                }
                                mongoDb.insertRoutine(req.headers.user, req.headers.pwd, req.headers.namegym,
                                    req.body.name, req.body.objective, exercisesArray,
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
                    } else {
                        res.status(404).send({
                            'success': false,
                            'message': "Clave incorrecta."
                        });
                    }
                }
            });


        }
    }
});


/**
 * Type: PUT
 * Name: routines/update
 * Description: Updates the specified Routine and returns for a given Gym and returns a feedback object.
 * Request:
 *      -Headers: Credentials
 *          -user: string
 *          -pwd: string
 *      -Body: A Routine object
 *          -nameGym: string
 *          -key: string
 *          -name: string
 *          -objective: string
 *          -exercises: [string]
 *          -repetitions: [int]
 *          -series: [int]
 *          -relaxTime: [double]
 * Responses:
 *      200:
 *          -A feedback object
 *      404:
 *          -A feedback object
 *      500:
 *          -A feedback object
 */
router.put('/update', function(req, res) {
    var coachKey;
    var userKey;
    if(!req.headers.user || !req.headers.pwd || !req.headers.namegym || !req.headers.key) {
        res.status(404).send({
            'success': false,
            'message': 'Cabecera de la peticion vacía o incorrecta.'
        })
    } else {
        if(!req.body.name || !req.body.objective || !req.body.relaxTime || !req.body.exercises) {
            res.status(404).send({
                'success': false,
                'message': 'Cuerpo de la peticion vacío o incorrecto.'
            })
        } else {
            mongoDb.getKeys(req.headers.user, req.headers.pwd, req.headers.namegym, function (err, result, result2){
                console.log(result);
                if(!err){
                    userKey = result;
                    coachKey = result2;
                    // If given key is a valid user or coach key for that gym
                    if(req.headers.key === coachKey){
                        var exercisesArray = {};
                        for(var i = 0; i < req.body.exercises.length; i++) {
                            exercisesArray[i] = {
                                name: req.body.exercises[i],
                                repetitions: req.body.repetitions[i],
                                series: req.body.series[i],
                                relaxTime: req.body.relaxTime[i]
                            }
                        }
                        mongoDb.updateRoutineByName(req.headers.user, req.headers.pwd, req.headers.namegym, req.body.name,
                            req.body.objective, exercisesArray, function(err, result) {
                                if(!err){
                                    res.status(200).send({
                                        'success': true,
                                        'message': "Rutina actualizada correctamente."
                                    })
                                } else{
                                    res.status(404).send({
                                        'success': false,
                                        'message': "Rutina inexistente."
                                    })
                                }
                            })
                    } else if(req.headers.key === userKey) {
                        res.status(404).send({
                            'success': false,
                            'message': "Permisos insuficientes."
                        })
                    } else{
                        res.status(404).send({
                            'success': false,
                            'message': 'Clave del gimnasio incorrecta o inválida.'
                        });
                    }
                }
                else{ //Error means the gym is not on the database, therefore we cannot continue.
                    res.status(404).send({
                        'success': false,
                        'message': err
                    });
                }
            });
        }
    }
});

module.exports = router;