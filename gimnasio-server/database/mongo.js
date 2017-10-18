var MongoClient = require('mongodb').MongoClient;

var exercise = require('./exercise');


var url = 'mongodb://localhost:27017/GimnasioAPP';       // Connection URL

function connect(callback, args) {
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log(err);
            return undefined;
        }
        else {
            callback(db, args);
            return db;
        }
    });
}

//=======================================Exercise tables===============================================================

function insertExercise(name, muscle, description, images, tag){

    connect(exercise.insertExercise, [name, muscle, description, images, tag]);

}

function getExerciseByName(name,callback){

    connect(exercise.insertExercise, [name, callback]);

}
function getExercisesByMuscle(muscle,callback){

    connect(exercise.insertExercise, [muscle, callback]);

}
function getExerciseByTag(tag,callback){

    connect(exercise.insertExercise, [tag, callback]);

}
function getExercises(callback){

    connect(exercise.getExercises,[callback]);

}

//function deleteExerciseByName(name, callback) {
//connect(exercise.deleteExerciseByName, [name, callback])
//}
//=======================================Routine tables===============================================================
exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercisesByMuscle = getExercisesByMuscle;
exports.getExerciseByTag = getExerciseByTag;
exports.getExercises = getExercises;

