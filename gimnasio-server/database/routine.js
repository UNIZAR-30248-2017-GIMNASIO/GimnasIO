function insertRoutine (db, args) {
    var collection = db.collection('routines');
    var callback = args[7];
    collection.insert([{nameGym: args[0], name: args[1], objective: args[2], series: args[3], rep: args[4],
            relaxTime: args[5], exercises: args[6]}], function (err, result) {
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

    collection.deleteOne({name: name}, function(err, result){
        if(!err) {
            if(!result){
                callback("Exercise not found", null);
            }
        }
        return callback(err, result);
    });
}

exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
exports.deleteRoutineByName = deleteRoutineByName;