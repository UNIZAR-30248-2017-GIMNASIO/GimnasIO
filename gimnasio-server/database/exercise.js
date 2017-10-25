function insertExercise(db,args){

    var collection = db.collection('exercises');

    var imageURL = args[3];

    var fs = require('fs');
    var fileExtension = require('file-extension');
    var request = require('request');
    var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };
    var ext = fileExtension(args[3]);
    var destiny = './imgs/' + args[0] + '.' + ext;
    download(imageURL, destiny, function(){
        //console.log('done');
    });
    //Insert a new exercise
    collection.insert([{name: args[0], muscle: args[1], description: args[2], images: destiny, tag: args[4]}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                console.log(err)
            } else {
                console.log('Inserted new exercise with name ' + args[0]);
            }
        }
    );

    db.close();

    //return true;

}

function getExerciseByName(db, args){

    var name = args[0];

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
function getExercisesByMuscle(db,args){

    var muscle = args[0];

    var callback = args[1];

    var collection = db.collection('exercises');

    collection.find({muscle: muscle}, function(err, result) {
        if (!err) {
            console.log('Getting all exercises which involves ' + muscle);
        }
        return callback(err, result);
    });
}
function getExerciseByTag(db,args) {

    var tag = args[0];

    var callback = args[1];

    var collection = db.collection('exercises');

    collection.find({tag: tag}, function(err, result) {
        if (!err) {
            console.log('Getting all exercises which involves ' + tag);
        }
        return callback(err, result);
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

/**
function deleteExerciseByName(name, callback) {

    connect(exercise.deleteExerciseByName, [name, callback])

}**/

exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercisesByMuscle = getExercisesByMuscle;
exports.getExerciseByTag = getExerciseByTag;
exports.getExercises = getExercises;