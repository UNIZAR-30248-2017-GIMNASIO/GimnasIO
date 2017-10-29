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

function getUserKey (db, args) {

    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.findOne({nameGym: nameGym}, function (err, result) {
       if (!err) {
           console.log('Found gym with name ' + nameGym);
           console.log(result.userKey);
       }
       return callback(err, result.userKey);
    });
}

function getCoachKey (db, args) {
    var collection = db.collection('gyms');

    var nameGym = args[0];
    var callback = args[1];

    collection.findOne({nameGym: nameGym}, function (err, result) {
        if (!err) {
            console.log('Found gym with name ' + nameGym);
        }
        return callback(err, result.coachKey);
    });
}

function hash(string) {
    var sh = require("shorthash");
    var id = sh.unique(string);
    console.log(id);
    return id;

}

exports.insertNewGym=insertNewGym;
exports.getUserKey=getUserKey;
exports.getCoachKey=getCoachKey;