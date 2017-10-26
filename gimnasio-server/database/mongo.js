var MongoClient = require('mongodb').MongoClient;

var exercise = require('./exercise');
var routine = require('./routine');
var gym = require('./gym');


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
//=======================================Massive population============================================================

function massiveInsertion(aa) {
    connect(exercise.massiveInsertion, [aa]);
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

//=======================================Gym tables===============================================================
function insertNewGym (nameGym) {
    connect(gym.insertNewGym, [nameGym]);
}

function getUserKey (nameGym, callback) {
    connect(gym.getUserKey, [nameGym, callback]);
}

function getCoachKey (nameGym, callback) {
    connect(gym.getCoachKey, [nameGym, callback]);
}

//=======================================Routine tables===============================================================
function insertRoutine(nameGym, name, objective, series, rep, relaxTime, exercises){

    connect(exercise.insertRoutine, [nameGym, name, objective, series, rep, relaxTime, exercises]);

}

function getRoutineByName(nameGym, name,callback){

    connect(exercise.getRoutineByName, [nameGym, name, callback]);

}
function getRoutinesByObjective(nameGym, objective,callback){

    connect(exercise.getRoutinesByObjective, [nameGym, objective, callback]);

}

function getRoutineOfAGym(nameGym, callback){

    connect(exercise.getRoutineOfAGym,[nameGym, callback]);

}


exports.massiveInsertion = massiveInsertion;
exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercisesByMuscle = getExercisesByMuscle;
exports.getExerciseByTag = getExerciseByTag;
exports.getExercises = getExercises;
exports.insertNewGym=insertNewGym;
exports.getUserKey = getUserKey;
exports.getCoachKey = getCoachKey;
exports.insertRoutine = insertRoutine;
exports.getRoutineByName = getRoutineByName;
exports.getRoutinesByObjective = getRoutinesByObjective;
exports.getRoutineOfAGym = getRoutineOfAGym;
