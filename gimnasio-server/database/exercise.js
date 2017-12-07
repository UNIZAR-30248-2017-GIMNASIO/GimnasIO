var utf8 = require('utf8');
var fs = require('fs');
var fileExtension = require('file-extension');
var request = require('request');

function insertExercise(db,args) {
    var collection = db.collection('exercises');
    var callback = args[5];
    var imageURL = args[3];

    var destiny = "";
    if (imageURL !== "") {
        var download = function (uri, filename, callback) {
            request.head(uri, function (err, res, body) {
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
        var ext = fileExtension(args[3]);
        var filename = args[0].replace(/\s+/g, '');
        filename = utf8.encode(filename);
        console.log(getCleanedString(filename));
        destiny = './data/images/' + getCleanedString(filename) + '.' + ext;
        download(imageURL, destiny, function () {
            console.log('Image downloaded at' + destiny);
        });
    }
    //Insert a new exercise
    collection.insert([{ name: args[0], muscle: args[1], description: args[2], tag: args[4]}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                return callback(err);
            } else {
                console.log('Inserted new exercise with name ' + args[0]);
                return callback(null, 'OK');
            }
        }
    );

    db.close();

}

function getExerciseByName(db, args){
    var name = args[0];
    console.log('Searching by field name:  ' + name);

    var callback = args[1];

    var collection = db.collection('exercises');

    collection.findOne({name: name}, function(err, exercise) {
        if (!err) {
            if (!exercise) {
                console.log('Exercise with name: ' + name + ' not found');
            }
        }
        return callback(err, exercise);
    });

}
function getExercises(db, args){

    var collection = db.collection('exercises');

    var callback = args[0];

    collection.find({}).toArray( function (err, result) {
        if (!err) {
            console.log('Getting all exercises');
        }
        return callback(err, result);
    });

}

function deleteExerciseByName(db, args){

    var collection = db.collection('exercises');

    var name = args[0];
    var callback = args[1];

    collection.deleteMany({name: name}, function(err, result) {
        if(!err) {
            if(!result){
                callback("Exercise not found", null);
            }
        }
        return callback(err, result);
    })
}

function getCleanedString(cadena){
    // Definimos los caracteres que queremos eliminar
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

    // Los eliminamos todos
    for (var i = 0; i < specialChars.length; i++) {
        cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g,"_");

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi,"a");
    cadena = cadena.replace(/é/gi,"e");
    cadena = cadena.replace(/í/gi,"i");
    cadena = cadena.replace(/ó/gi,"o");
    cadena = cadena.replace(/ú/gi,"u");
    cadena = cadena.replace(/ñ/gi,"n");
    return cadena;
}

exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercises = getExercises;
exports.deleteExerciseByName = deleteExerciseByName;