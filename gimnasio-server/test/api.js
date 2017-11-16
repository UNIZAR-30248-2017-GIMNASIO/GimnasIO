var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
//var server = "localhost:3000";
var should = chai.should();
var expect = chai.expect;
var assert = require('assert');
var mongoDb = require('../database/mongo');

chai.use(chaiHttp);
chai.use(require('chai-json'));
//Our parent block

describe('Exercises', function() {
    /*
     * Insert an exercise
     */
    before(function(done) {
        mongoDb.insertExercise("gpsAdmin", "Gps@1718", "autotest", "autotest", "autotest", "", "autotest", function (err, res) {
            done();
        });
    });

    describe('GET exercises', function() {
        it('should GET all the exercises', function(done) {
            chai.request(server)
                .get('/exercises')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.an('Object');
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('muscle');
                    res.body[0].should.have.property('description');
                    res.body[0].should.have.property('tag');
                    done();
                })
        });
        it('should return an error message when trying to GET without user, pwd or nameGym', function(done) {
            chai.request(server)
                .get('/exercises')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Cabecera de la peticion vacía o incorrecta.');
                    done();
                })
        });
        //TODO: call does not return anything but it fails, uncomment when fixed
        it('should return an error message when trying to GET with an incorrect user or password', function(done) {
            chai.request(server)
                .get('/exercises')
                .set('user', 'error')
                .set('pwd', 'error')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
    });
    /*
     * Delete the previously inserted exercise
     */
    after(function(done) {
        mongoDb.deleteExerciseByName("gpsAdmin", "Gps@1718", "autotest", function(){
            done();
        })
    });

});

//TODO: not passing yet
describe('Routines', function() {

    var key = "";
    /*
     * Insert a gym and a routine
     */
    before(function(done) {
        mongoDb.insertRoutine("gpsAdmin", "Gps@1718", "autotest", "autotest", "autotest", 1, 1, [], "", function (err, res) {
            mongoDb.insertNewGym("gpsAdmin", "Gps@1718", "autotest", function (err, key1, key2) {
                key = key2;
                done();
            })
        });
    });

    describe('GET routines', function() {
        it('it should GET all the routines', function(done) {
            chai.request(server)
                .get('/routines')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('key', key)
                .set('nameGym', 'autotest')
                .set('Content-Type', 'application/json')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body[0].should.have.property('_id');
                    res.body[0]._id.should.be.a('string');
                    res.body[0].should.have.property('nameGym');
                    res.body[0].nameGym.should.be.a('string');
                    res.body[0].should.have.property('name');
                    res.body[0].name.should.be.a('string');
                    res.body[0].should.have.property('objective');
                    res.body[0].objective.should.be.a('string');
                    res.body[0].should.have.property('series');
                    res.body[0].series.should.be.equal(1);
                    res.body[0].should.have.property('rep');
                    res.body[0].rep.should.be.equal(1);
                    res.body[0].should.have.property('relaxTime');
                    //res.body[0].relaxTime.should.be.equal(1);
                    res.body[0].should.have.property('exercises');
                    //res.body[0].nameGym.should.be.an('array');
                    done();
                })
        })
    });

    /*
     * Delete the previously inserted routine and gym
     */
    after(function(done) {
        mongoDb.deleteRoutineByName("gpsAdmin", "Gps@1718", "autotest", function(){
            mongoDb.deleteGymByName("gpsAdmin", "Gps@1718", "autotest", function(){
                done();
            });
        });

    });
});

describe('dbdata', function() {

    // before(function(done) {
    //     var fs = require('fs');
    //     var request = require('request');
    //     var fileExtension = require('file-extension');
    //     var utf8 = require('utf8');
    //
    //     var download = function (uri, filename, callback) {
    //         request.head(uri, function (err, res, body) {
    //             request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    //         });
    //     };
    //     var ext = fileExtension("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM5544_with_non-PAL_signals.png/384px-PM5544_with_non-PAL_signals.png");
    //     var filename = "test";
    //     filename = utf8.encode(filename);
    //     destiny = './data/images/' + filename + '.' + ext;
    //     download("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM5544_with_non-PAL_signals.png/384px-PM5544_with_non-PAL_signals.png", destiny, function () {
    //         console.log('done downloading image');
    //         done();
    //     });
    //     //done();
    // });

    describe('GET dbdata', function () {
        it('should get the db data', function(done) {
            chai.request(server)
                .get('/dbdata')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.should.have.property('imageSize');
                    res.body.imageSize.should.be.an('String');
                    res.body.should.have.property('dataSize');
                    res.body.dataSize.should.be.an('String');
                    res.body.should.have.property('totalSize');
                    res.body.totalSize.should.be.an('String');
                    res.body.should.have.property('lastUpdate');
                    res.body.lastUpdate.should.be.an('String');
                    done();
                })
        });
        it('should return an error message when trying to GET with an incorrect user or password', function(done) {
            chai.request(server)
                .get('/dbdata')
                .set('user', 'error')
                .set('pwd', 'error')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('error');
                    res.body.error.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it('should return an error message when trying to GET with an empty header', function(done) {
            chai.request(server)
                .get('/dbdata')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('error');
                    res.body.error.should.equal('Cabecera de la petición vacía o incompleta.');
                    done();
                })
        })
    });

    // after(function(done) {
    //     var fs = require('fs');
    //     fs.unlink("./data/images/test.png");
    //     done();
    // })
});

