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
router.get('/', function(req, res) {
    var userKey = 0;
    var coachKey = 0;
    if(req.headers.user && req.headers.pwd && req.headers.namegym && req.headers.key){
        mongoDb.getUserKey(req.headers.user, req.headers.pwd, req.headers.namegym, function(err, result){
            if(!err){
                userKey = result;
            }
            else{ //Error means the gym is not on the database, therefore we cannot continue.
                res.status(404).send({
                    'success': false,
                    'message': 'Gimnasio no registrado.'
                });
                return 0;
            }
        });

        mongoDb.getCoachKey(req.headers.user, req.headers.pwd, req.headers.namegym, function (err, result){
            if(!err){
                coachKey = result;
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
                        'message': 'Nombre o clave incorrecta'
                    });
                }
            }
            else{ //Error means the gym is not on the database, therefore we cannot continue.
                res.status(404).send({
                    'success': false,
                    'message': 'Gimnasio no registrado.'
                });
                return 0;
            }
        });
    }
    else res.status(404).send({
        'success': false,
        'message': 'Cabecera de la petición vacía o incompleta.'
    })
});

module.exports = router;