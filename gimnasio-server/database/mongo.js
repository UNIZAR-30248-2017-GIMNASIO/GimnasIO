var MongoClient = require('mongodb').MongoClient;

var exercise = require('./exercise');
var routine = require('./routine');
var gym = require('./gym');


var url = 'mongodb://localhost:27017/GimnasioAPP';       // Connection URL

function connect(callback, args, u, p) {

    MongoClient.connect(url, {
        auth: {
            user: u,
            password: p
        }
    }, function (err,db) {
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

function insertExercise(u, p, name, muscle, description, images, tag, callback){

    connect(exercise.insertExercise, [name, muscle, description, images, tag, callback], u, p);

}

function getExerciseByName(u, p, name,callback){

    connect(exercise.getExerciseByName, [name, callback], u, p);

}
function getExercises(u, p, callback){

    connect(exercise.getExercises,[callback], u, p);

}
function deleteExerciseByName(u, p, name, callback){
    connect(exercise.deleteExerciseByName, [name, callback], u, p);
}

//=======================================Gym tables===============================================================
function insertNewGym (u, p, nameGym, callback) {
    connect(gym.insertNewGym, [nameGym, callback], u, p);
}

function getUserKey (u, p, nameGym, callback) {
    connect(gym.getUserKey, [nameGym, callback], u, p);
}

function getCoachKey (u, p, nameGym, callback) {
    connect(gym.getCoachKey, [nameGym, callback], u, p);
}

//=======================================Routine tables===============================================================
function insertRoutine(u, p, nameGym, name, objective, series, rep, relaxTime, exercises, callback){

    connect(routine.insertRoutine, [nameGym, name, objective, series, rep, relaxTime, exercises, callback], u, p);

}

function getRoutinesOfAGym(u, p, nameGym, callback){

    connect(routine.getRoutinesOfAGym,[nameGym, callback], u, p);

}

exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercises = getExercises;
exports.deleteExerciseByName = deleteExerciseByName;
exports.insertNewGym=insertNewGym;
exports.getUserKey = getUserKey;
exports.getCoachKey = getCoachKey;
exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
