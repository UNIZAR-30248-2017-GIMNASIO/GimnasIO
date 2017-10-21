var express = require('express');
var router = express.Router();

/* GET exercises listing. */
router.get('/', function(req, res, next) {
    //TODO Devolver las rutinas de un gym dada la clave
    res.send('rutinas');
});

module.exports = router;
