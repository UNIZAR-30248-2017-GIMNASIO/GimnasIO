var MongoClient = require('mongodb').MongoClient;

var exercise = require('./exercise');
var routine = require('./routine');


var url = 'mongodb://localhost:27017/GimnasioAPP';       // Connection URL

function connect(u, p, callback, args) {
    MongoClient.connect(url, function (err, db) {
        //db.authenticate('user', 'name', function(err, result) {
            //assert.equal(true, result);
            if (err) {
                console.log(err);
                return err;
            }
            else {
                callback(db, args);
                return db;
            }
            db.close();
        //});

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
function insertRoutine(nameGym, name, objective, series, rep, relaxTime){

    connect(exercise.insertRoutine, [nameGym, name, objective, series, rep, relaxTime]);

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
exports.insertExercise = insertExercise;
exports.getExerciseByName = getExerciseByName;
exports.getExercisesByMuscle = getExercisesByMuscle;
exports.getExerciseByTag = getExerciseByTag;
exports.getExercises = getExercises;
exports.insertRoutine = insertRoutine;
exports.getRoutineByName = getRoutineByName;
exports.getRoutinesByObjective = getRoutinesByObjective;
exports.getRoutineOfAGym = getRoutineOfAGym;
