var ObjectID = require('mongodb').ObjectID;

function insertRoutine (db, args) {
    var collection = db.collection('routines');
    console.log(args);
    var callback = args[4];
    collection.insert([{nameGym: args[0], name: args[1], objective: args[2],
            exercises: args[3]}], function (err, result) {
        console.log(result.ops[0]._id);
            if(err){
                console.log('An error ocurred.');
                return callback(err);
            }
            else{
                console.log('Inserted new routine in gym: '+ args[0] + ' with name ' + args[1]);
                return callback(null, result.ops[0]._id);
            }
        }
    );
    db.close();
}

function getRoutinesOfAGym (db, args) {
    var collection = db.collection('routines');
    var callback = args[1];

    collection.find({nameGym: args[0]}).toArray( function (err, result) {
        if(!err){
            console.log('Getting all routines of the gym: ' + args[0]);
        }
        return callback(err, result);
    });
}

function deleteRoutineByName (db, args) {
    var collection = db.collection('routines');
    var name = args[0];
    var nameGym = args[1];
    var callback = args[2];

    collection.deleteMany({name: name, nameGym: nameGym}, function(err, result){
        if(!err) {
            if(!result){
                callback("Exercise not found", null);
            }
        }
        return callback(err, result);
    });
}

function deleteRoutineById (db, args) {
    var collection = db.collection('routines');
    var nameGym = args[1];
    var callback = args[2];

    collection.deleteMany({_id: new ObjectID(args[0])}, function(err, result){
        console.log(result.result);
        if(!err) {
            if(!result){
                callback("Exercise not found", null);
            }
        }
        return callback(err, result);
    });
}

function updateRoutineByID (db, args) {
    var collection = db.collection('routines');
    var callback = args[5];
    collection.update({_id: new ObjectID(args[0])}, {nameGym: args[1], name: args[2], objective: args[3],
            exercises: args[4]}, function (err, result) {
        console.log(result.result);
            if(err){
                console.log('An error ocurred. ' + err);
                return callback(err);
            }
            else{
                console.log('Updated routine in gym: '+ args[1] + ' with id ' + args[0]);
                return callback(err, 'OK');
            }
        }
    );
    db.close();
}

exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
exports.deleteRoutineByName = deleteRoutineByName;
exports.deleteRoutineById = deleteRoutineById;
exports.updateRoutineById = updateRoutineByID;