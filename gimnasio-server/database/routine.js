function insertRoutine (db, args) {
    var collection = db.collection('routines');
    console.log(args);
    var callback = args[5];
    collection.insert([{nameGym: args[0], name: args[1], objective: args[2],
            relaxTime: args[3], exercises: args[4]}], function (err, result) {
            if(err){
                console.log('An error ocurred.');
                return callback(err);
            }
            else{
                console.log('Inserted new routine in gym: '+ args[0] + ' with name ' + args[1]);
                return callback(err, 'OK');
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
    var callback = args[1];

    collection.deleteMany({name: name}, function(err, result){
        if(!err) {
            if(!result){
                callback("Exercise not found", null);
            }
        }
        return callback(err, result);
    });
}

function updateRoutineByName (db, args) {
    var collection = db.collection('routines');
    var callback = args[5];
    console.log("name: " + args[1]);
    collection.update({name: args[1]}, {nameGym: args[0], name: args[1], objective: args[2],
            relaxTime: args[3], exercises: args[4]}, function (err, result) {
            if(err){
                console.log('An error ocurred. ' + err);
                return callback(err);
            }
            else{
                console.log('Inserted new routine in gym: '+ args[0] + ' with name ' + args[1]);
                return callback(err, 'OK');
            }
        }
    );
    db.close();
}

exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
exports.deleteRoutineByName = deleteRoutineByName;
exports.updateRoutineByName = updateRoutineByName;