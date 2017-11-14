var express = require('express');
var router = express.Router();

//var exerciseDb = require('../database/exercise');
var mongoDb = require('../database/mongo');

/**
 * Type: GET
 * Name: /exercises/
 * Description: Returns a JSON containing every exercise on the Database.
 * Request:
 *     -Headers: Credentials
 *       -user: string
 *       -pwd: string
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
router.get('/', function(req, res) {
    console.log(req.headers);
    if(req.headers.user && req.headers.pwd){
        mongoDb.getExercises(req.headers.user, req.headers.pwd, function (err, result) {
            if(!err){
                var jsonres = {};
                for(var i=0; i < result.length; i++) {
                    jsonres[i] = result[i];
                }
                res.status(200).json(jsonres);
            }
            else res.status(404).send({
                'success': false,
                'message': 'Empty database. Please contact an administrator.'
            });
        })
    }
    else res.status(404).send({
        'success': false,
        'message': "Cabecera de la peticion vacía o incorrecta."
    });

});

/**
 * Type: POST
 * Name: /exercises/insertion
 * Description: Inserts a new exercise into database from json.
 * Request:
 *     -Headers: Credentials
 *       -user: string
 *       -pwd: string
 *     -Body: JSON exercise object
 *       -id: string
 *       -name: string
 *       -muscle: string
 *       -description: string
 *       -images: [string]
 *       -tag: string
 *       -user: string
 *       -pwd: string
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

    if (req.headers.user && req.headers.pwd && req.body.name && req.body.muscle && req.body.tag){
        var user = req.headers.user;
        var pwd = req.headers.pwd;
        mongoDb.getExerciseByName(user, pwd, req.body.name, function (err, result) {
                var name = req.body.name;
                var muscle = req.body.muscle;
                var description = req.body.description;
                var image = req.body.image;
                var tag = req.body.tag;
                if (!result) {
                    mongoDb.insertExercise(user, pwd, name, muscle, description, image, tag, function (result) {
                        if (result !== 'OK') {
                            ok = false;
                            res.status(500).send({
                                'success': false,
                                'message': "Error de inserción. Inténtalo más tarde o informa al administrador."
                            })
                        } else {
                            mongoDb.getLastUpdate(user, pwd, function (result) {
                               if (!result) {
                                   mongoDb.insertlastUpdate(user,pwd, function (res) {
                                       console.log("Inserted lastUpdate");
                                   });
                               } else {
                                   mongoDb.updateLastUpdate(user,pwd,res.body.lastUpdate, function (res) {
                                       console.log("Updated lastUpdate");
                                   });
                               }
                            });
                            res.status(200).send(result);
                        }
                    });
                } else res.status(404).send({
                    'success': false,
                    'message': "El ejercicio ya se encuentra en la Base de Datos"
                });
        });
    }
    else res.status(404).send({
        'success': false,
        'message': "Cuerpo de la petición vacío o incompleto."
    })
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
                jsonArrayObj.forEach( function (objeto) {
                    var name = objeto.Nombre;
                    var muscle = objeto.Musculos;
                    var description = objeto.Descripcion;
                    var image = objeto.Imagen;
                    var tag = objeto.Tag;
                    mongoDb.getExerciseByName(req.headers.user, req.headers.pwd, name, function (err, result) {
                        if (!result) {
                            mongoDb.insertExercise(req.headers.user, req.headers.pwd, name,muscle,description,image,tag, function (result) {
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
                    mongoDb.getLastUpdate(req.body.user, req.body.pwd, function (result) {
                        if (!result) {
                            mongoDb.insertlastUpdate(req.body.user,req.body.pwd, function (res) {
                                console.log("Inserted lastUpdate");
                            });
                        } else {
                            mongoDb.updateLastUpdate(req.body.user,req.body.pwd,res.body.lastUpdate, function (res) {
                                console.log("Updated lastUpdate");
                            });
                        }
                    });
                    res.status(200).send('OK');
                }

            }
        });
});

router.get('/download', function(req, res){
    var fileExtension = require('file-extension');
    var file = req.headers.image;
    var ext = fileExtension(file);
    console.log(file);
    //if (ext === '.gif' || ext ==='.png' || ext === '.jpg') {
        var img = './data/images/' + file;
        res.download(img); // Set disposition and send it.
    /*} else {
        res.status(403).send({
            'success': false,
            'message': 'Not permitted'
        });
    }*/
});

module.exports = router;
