function insertLastUpdate(db,args){
    var collection = db.collection('lastUpdate');
    var callback = args[0];

    var date = new Date();
    console.log(date);

    //Insert a new exercise
    collection.insert([{ lastupdate: date}],
        function (err) {
            if (err) {
                console.log('An error ocurred.');
                return callback(err);
            } else {
                console.log('Inserted new uptdate with date ' + date);
                return callback('OK');
            }
        }
    );

    db.close();

}

function updateLastUpdate(db, args) {
    var collection = db.collection('lastUpdate');
    var callback = args[1]
    var date = new Date();
    console.log(date);
    collection.update({lastUpdate: args[0]}, {$set:{lastUpdate: date}});
}

function getLastUpdate(db, args) {
    var collection = db.collection('lastUpdate');

    var callback = args[0];

    collection.find({}).toArray( function (err, result) {
        if (!err) {
            console.log('Getting lastUpdate');
        }
        return callback(err, result);
    });

}
exports.insertLastUpdate = insertLastUpdate;
exports.updateLastUpdate = updateLastUpdate;
exports.getLastUpdate = getLastUpdate;