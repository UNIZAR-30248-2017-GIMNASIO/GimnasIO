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
        if(!err){
            res.status(200).send(result);
        }
        else res.status(404).send('Empty database. Please contact an administrator.');
    })
});

/**
 * Type: POST
 * Name: /exercises/insertion
 * Description: Inserts a new exercise into database from json.
 * Request:
 *     -Body: JSON exercise object
 *          -name: string
 *          -muscle: string
 *          -description: string
 *          -images: [string]
 *          -tag: string
 * Responses:
 *      200:
 *          -A feedback message
 *      404:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.post('/insertion', function (req, res) {
    var ok = true;
    if(req.body.name && req.body.muscle && req.body.image && req.body.tag){
        var name = req.body.name;
        var muscle = req.body.muscle;
        var description = req.body.description;
        var image = req.body.image;
        var tag = req.body.tag;
        mongoDb.getExerciseByName(name, function (err, result) {
            if (!result) {
                mongoDb.insertExercise(name,muscle,description,image,tag, function (result) {
                    if (result !== 'OK') {
                        ok = false;
                    }
                });
            } else {
                console.log('Exercise with name ' + name + ' found, maybe u are trying to fuck my mongo?');
            }
        });

        if(ok){
            res.status(200).send('OK');
        }
    }
    else res.status(404).send("Cuerpo de la petición vacío o incompleto.")
});

/**
 * de momento se queda asi, pero habra que moverlo a otro metodo
 */
router.post('/massive', function(req, res) {
    // require csvtojson
    var csv = require("csvtojson");

    // Convert a csv file with csvtojson
    var ok = true;
    csv()
        .fromFile('./data/files/ejercicios.csv')
        .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
            //console.log(jsonArrayObj);
            if (jsonArrayObj !== null) {
                var n = 0;
                jsonArrayObj.forEach( function (objeto) {
                    var name = objeto.Nombre;
                    var muscle = objeto.Musculos;
                    var description = objeto.Descripcion;
                    var image = objeto.Imagen;
                    var tag = objeto.Tag;
                    mongoDb.getExerciseByName(name, function (err, result) {
                        if (!result) {
                            mongoDb.insertExercise(name,muscle,description,image,tag, function (result) {
                                if (result !== 'OK') {
                                    ok = false;
                                }
                            });
                        } else {
                            console.log('Exercise with name ' + name + ' found, maybe u wanna try to fuck my mongo?');
                        }
                    });

                });
                if (ok) {
                    res.status(200).send('OK MORO');
                }

            }
        });
});
module.exports = router;
