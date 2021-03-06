var express = require('express');
var router = express.Router();

var getSize = require('get-folder-size');

var mongoDb = require('../database/mongo');
/**
 * Type: GET
 * Name: dbdata/
 * Description: Returns a JSON containing the Database info.
 * Request:
 *      -user: string
 *      -pwd: string
 * Responses:
 *      200:
 *          -JSON object containing multiple db information:
 *              -dbSize: double (in MB)
 *              -imageSize: double (in MB)
 *              -totalSize: double (in MB)
 *              -lastUpdate: date
 *      404:
 *          -A feedback message
 *      500:
 *          -A feedback message
 */
router.get('/', function(req, res) {
    var user = req.headers.user;
    var pwd = req.headers.pwd;
    console.log(req.headers.user);
    if(!req.headers.user || !req.headers.pwd) {
        console.log("error");
        res.status(404).send({
            success: false,
            message: "Cabecera de la petición vacía o incompleta."
        })
    }
    else {
        console.log("Recibida peticion datos db");
        getSize('./data/images', function (err, size) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    success: false,
                    message: 'Error al calcular tamaño de imagenes, informe a un administrador'
                });
            }
            else {
                console.log(size);
                var imageSize = (size / 1024 / 1024);
                mongoDb.getStats(user, pwd, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(404).send({
                            success: false,
                            message: err
                        });
                    }
                    else {
                        console.log(result);
                        var dataSize = (result.stats.dataSize / 1024 / 1024);
                        var lastUpdate = result.lastUpdate;
                        var totalSize = imageSize + dataSize;
                        res.status(200).send({
                            imageSize: imageSize.toFixed(2),
                            dataSize: dataSize.toFixed(2),
                            totalSize: totalSize.toFixed(2),
                            lastUpdate: lastUpdate
                        })
                    }
                })
            }
        })
    }
});

module.exports = router;
