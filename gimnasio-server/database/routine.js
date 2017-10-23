function insertRoutine (db, args) {
    var collection = db.collection('routines');
    collection.insert([{nameGym: args[0], name: args[1], objective: args[2], series: destiny, rep: args[4], relaxTime: args[5]}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                console.log(err)
            } else {
                console.log('Inserted new routine in gym: '+ args[0] + 'with name ' + args[1]);
            }
        }
    );

    db.close();


}

function getRoutinesByName (db, args) {
    var collection = db.collection('routines');

    var callback = args[2];

    var nameGym = args[0];

    var name = args[1];

    collection.findOne([{nameGym: nameGym, name: name}]).toArray(function (err, result) {
        if (!err) {

            console.log('Getting routine ' + name + 'of Gym: ' + nameGym);
            return callback(err, result);

        }

    });

    db.close();


}

function getRoutinesByObjective (db, args) {
    var collection = db.collection('routines');

    var callback = args[2];

    collection.find([{nameGym: args[0], objective: args[1]}]).toArray(function (err, result) {
        if (!err) {

            console.log('Getting all routines of the gym ' + args[0] + 'with objective: ' + args[1]);
            return callback(err, result);

        }

    });

    db.close();
}

function getRoutinesOfAGym (db, args) {
    var collection = db.collection('routines');

    var callback = args[1];

    collection.find({nameGym: args[0]}).toArray( function (err, result) {

        if (!err) {

            console.log('Getting all routines of the gym: ' + args[0]);
            return callback(err, result);

        }
    });



}

exports.insertRoutine = insertRoutine;
exports.getRoutinesOfAGym = getRoutinesOfAGym;
exports.getRoutineByObjective = getRoutinesByObjective;
exports.getRoutinesByName = getRoutinesByName;