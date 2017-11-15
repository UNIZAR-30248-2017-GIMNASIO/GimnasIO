function insertExercise(db,args) {
    var collection = db.collection('exercises');
    var callback = args[5];

    var imageURL = args[3];

    var fs = require('fs');
    var fileExtension = require('file-extension');
    var request = require('request');
    var destiny = "";
    if (imageURL !== "") {
        var download = function (uri, filename, callback) {
            request.head(uri, function (err, res, body) {
                //console.log('content-type:', res.headers['content-type']);
                //console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            });
        };
        var ext = fileExtension(args[3]);
        destiny = './data/images/' + args[0] + '.' + ext;
        download(imageURL, destiny, function () {
            //console.log('done');
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
                return callback('OK');
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

/**
function deleteExerciseByName(name, callback) {

    connect(exercise.deleteExerciseByName, [name, callback])

}**/

exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercises = getExercises;
exports.deleteExerciseByName = deleteExerciseByName;