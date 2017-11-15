var MongoClient = require('mongodb').MongoClient;

var exercise = require('./exercise');
var routine = require('./routine');
var gym = require('./gym');
var update = require('./update');


var url = 'mongodb://localhost:27017/GimnasioAPP';       // Connection URL

function connect(operation, args, u, p) {
    MongoClient.connect(url, {
        auth: {
            user: u,
            password: p
        }
    }, function (err, db) {
        if (err) {
            var l = args.length;
            args[l-1]("Usuario o contraseña incorrectos.", null);
            return 0;
        }
        else {
            operation(db, args);
            return db;

        }
    });
}
//=======================================Exercise tables===============================================================

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

function deleteGymByName (u, p, nameGym, callback) {
    connect(gym.deleteGymByName, [nameGym, callback], u, p);
}

//=======================================Routine tables===============================================================
function insertRoutine(u, p, nameGym, name, objective, series, rep, relaxTime, exercises, callback){
    connect(routine.insertRoutine, [nameGym, name, objective, series, rep, relaxTime, exercises, callback], u, p);
}

function getRoutinesOfAGym(u, p, nameGym, callback) {
    connect(routine.getRoutinesOfAGym, [nameGym, callback], u, p);
}
function deleteRoutineByName(u, p, name, callback){
    connect(routine.deleteRoutineByName, [name, callback], u, p);
}

function insertlastUpdate(u,p,callback){
    connect(update.insertlastUpdate, [callback],u,p);
}

function updateLastUpdate(u,p, lastUpdate, callback) {
    connect(update.updateLastUpdate, [lastUpdate, callback],u,p);
}

function getLastUpdate(u,p,callback) {
    connect(update.getLastUpdate, [callback], u, p);
}

exports.getExerciseByName = getExerciseByName;
exports.getExercises = getExercises;
exports.deleteExerciseByName = deleteExerciseByName;
exports.insertNewGym=insertNewGym;
exports.getUserKey = getUserKey;
exports.getCoachKey = getCoachKey;
exports.deleteGymByName = deleteGymByName;
exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
exports.deleteRoutineByName = deleteRoutineByName;
exports.insertlastUpdate = insertlastUpdate;
exports.updateLastUpdate = updateLastUpdate;
exports.getLastUpdate = getLastUpdate;