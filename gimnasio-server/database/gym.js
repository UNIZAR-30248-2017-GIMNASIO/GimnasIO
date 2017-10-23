function insertNewGym (db, args) {

    var collection = db.collection('gyms');

    var nameGym = args[0];

    var tempUserKey = nameGym + 'userKey';

    var tempCoachKey = nameGym + 'coachKey';

    collection.insert([{nameGym: args[0], userKey: hash(tempUserKey), coachKey: hash(tempCoachKey)}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                console.log(err)
            } else {
                console.log('Inserted new gym with name ' + nameGym);
            }
        }
    );

    db.close();

}

function getUserKey (db, args) {

    var collection = db.collection('gyms');

    var nameGym = args[0];

    collection.findOne({nameGym: nameGym}, function (err, result) {
       if (!err) {
           console.log('Found gym with name ' + nameGym);
           return callback(err, result.body.userKey);
       }
    });
}

function getCoachKey (db, args) {
    var collection = db.collection('gyms');

    var nameGym = args[0];

    collection.findOne({nameGym: nameGym}, function (err, result) {
        if (!err) {
            console.log('Found gym with name ' + nameGym);
            return callback(err, result.body.coachKey);
        }
    });
}

function hash(string) {

    var result = string;

    return result;

}

exports.insertNewGym=insertNewGym;
exports.getUserKey=getUserKey;
exports.getCoachKey=getCoachKey;