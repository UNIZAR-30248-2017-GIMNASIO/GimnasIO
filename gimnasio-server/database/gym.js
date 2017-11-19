function insertNewGym (db, args) {

    var collection = db.collection('gyms');

    var callback = args[1];

    var nameGym = args[0];

    var tempUserKey = nameGym + 'userKey';

    var tempCoachKey = nameGym + 'coachKey';
    var userKey = hash(tempUserKey);
    var coachKey = hash(tempCoachKey);

    collection.insert([{nameGym: args[0], userKey: userKey, coachKey: coachKey}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                return callback(err, null, null);
            } else {
                console.log('Inserted new gym with name ' + nameGym + ' userKey: ' +userKey +' coachKey: '+ coachKey);
                return callback(null, userKey, coachKey);
            }
        }
    );

    db.close();

}

function getGymByName (db, args) {
    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.findOne({nameGym: nameGym}, function(err, result) {
        if(!err){
            console.log("Found Gym");
            return callback(null, "OK")
        }
        else return callback("Gimnasio no registrado.", null);
    })
}

function getUserKey (db, args) {

    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.findOne({nameGym: nameGym}, function (err, result) {
        var resultF = null;
        if (result) {
           console.log('Found gym with name ' + nameGym);
           err = null;
           resultF = result.userKey;
        }
        else{
            err = "Gimnasio no registrado.";
        }
        return callback(err, resultF);
    });
}

function getCoachKey (db, args) {
    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.findOne({nameGym: nameGym}, function (err, result) {
        var resultF = null;
        if (result) {
            console.log('Found gym with name ' + nameGym);
            resultF = result.coachKey;
            err = null;
        }
        else{
            err = "Gimnasio no registrado.";
        }
        return callback(err, resultF);
    });
}

function deleteGymByName (db, args) {
    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.deleteMany({nameGym: nameGym}, function (err, result) {
        var res = "";
        var error = "";
        if (!err) {
            res = "Deleted correctly";
            error = null;
        }
        else{
            error = err;
            res = null;
        }
        return callback(error, res);
    })
}

function hash(string) {
    var sh = require("shorthash");
    var id = sh.unique(string);
    return id;

}

exports.insertNewGym=insertNewGym;
exports.getGymByName=getGymByName;
exports.getUserKey=getUserKey;
exports.getCoachKey=getCoachKey;
exports.deleteGymByName=deleteGymByName;