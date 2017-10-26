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

function insertExercise(name, muscle, description, images, tag, callback){

    connect(exercise.insertExercise, [name, muscle, description, images, tag, callback]);

}

function getExerciseByName(name,callback){

    connect(exercise.getExerciseByName, [name, callback]);

}
function getExercises(callback){

    connect(exercise.getExercises,[callback]);

}

//=======================================Gym tables===============================================================
function insertNewGym (nameGym, callback) {
    connect(gym.insertNewGym, [nameGym, callback]);
}

function getUserKey (nameGym, callback) {
    connect(gym.getUserKey, [nameGym, callback]);
}

function getCoachKey (nameGym, callback) {
    connect(gym.getCoachKey, [nameGym, callback]);
}

//=======================================Routine tables===============================================================
function insertRoutine(nameGym, name, objective, series, rep, relaxTime, exercises, callback){

    connect(routine.insertRoutine, [nameGym, name, objective, series, rep, relaxTime, exercises, callback]);

}

function getRoutinesByName(nameGym, name,callback){

    connect(routine.getRoutinesByName, [nameGym, name, callback]);

}
function getRoutinesByObjective(nameGym, objective,callback){

    connect(routine.getRoutinesByObjective, [nameGym, objective, callback]);

}

function getRoutinesOfAGym(nameGym, callback){

    connect(routine.getRoutinesOfAGym,[nameGym, callback]);

}


exports.massiveInsertion = massiveInsertion;
exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercises = getExercises;
exports.insertNewGym=insertNewGym;
exports.getUserKey = getUserKey;
exports.getCoachKey = getCoachKey;
exports.insertRoutine = insertRoutine;
exports.getRoutinesByName = getRoutinesByName;
exports.getRoutinesByObjective = getRoutinesByObjective;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
