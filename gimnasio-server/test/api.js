var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
//var server = "localhost:32001";
var should = chai.should();
var expect = chai.expect;
var assert = require('assert');
var mongoDb = require('../database/mongo');

chai.use(chaiHttp);
chai.use(require('chai-json'));
//Our parent block

describe('Index', function() {
    describe('GET index', function() {
        it('should return an index page', function(done) {
            chai.request(server)
                .get('/')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.text.should.be.a('String');
                    done();
                })
        })
    })
});
describe('Exercises', function() {
    /*
     * Insert an exercise
     */
    before(function(done) {
        mongoDb.insertExercise("gpsAdmin", "Gps@1718", "autotest", "autotest", "autotest", "", "autotest", function (err, res) {
            if(err){
                console.log("Error al insertar ejercicio");
            }
            else{
                console.log("Ejercicio insertado correctamente");
            }
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
        it('should return an error message when trying to GET with an empty header', function(done) {
            chai.request(server)
                .get('/exercises')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Cabecera de la peticion vacía o incorrecta.');
                    done();
                })
        });
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

    describe('GET image', function() {
       it('should GET an image if asked correctly', function(done) {
           chai.request(server)
               .get('/exercises/download')
               .set('image', 'test.png')
               .end(function(err, res) {
                   res.should.have.status(200);
                   res.body.should.not.have.property('success');
                   done();
               })
       });
       it('should return an error message when trying to GET with an incorrect image filename', function(done){
           chai.request(server)
               .get('/exercises/download')
               .set('image', 'error')
               .end(function(err, res) {
                   res.should.have.status(404);
                   res.body.should.have.property('success');
                   res.body.success.should.be.equal(false);
                   res.body.should.have.property('message');
                   res.body.message.should.be.equal('Archivo no existente.');
                   done();
               })
       })
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

describe('Routines', function() {

    var userKey;
    var coachKey;
    /*
     * Insert a gym and a routine
     */
    before(function(done) {
        mongoDb.insertRoutine("gpsAdmin", "Gps@1718", "autotest", "autotest", "autotest", [], function (err, res) {
            if(err){
                console.log("Fallo al intentar insertar rutina");
                done();
            }
            else{
                mongoDb.insertNewGym("gpsAdmin", "Gps@1718", "autotest", function (err, uKey, cKey) {
                    if(err){
                        console.log("Fallo al intentar insertar gym");
                    }
                    else{
                        userKey = uKey;
                        coachKey = cKey;
                        console.log("Todo OK ");
                    }
                    done();
                });
            }
        });
    });

    describe('GET routines', function() {
        it('it should GET all the routines', function(done) {
            chai.request(server)
                .get('/routines')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('key', userKey)
                .set('namegym', 'autotest')
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
                    res.body[0].should.have.property('exercises');
                    res.body[0].exercises.should.be.an('array');
                    done();
                })
        });
        it('should return an error message when trying to GET with an empty header', function(done) {
            chai.request(server)
                .get('/routines')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Cabecera de la peticion vacía o incorrecta.');
                    done();
                })
        });
        it('should return an error message when trying to GET with an incorrect user or password', function(done) {
            chai.request(server)
                .get('/routines')
                .set('user', 'error')
                .set('pwd', 'error')
                .set('key', userKey)
                .set('nameGym', 'autotest')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it('should return an error message when trying to GET with an incorrect nameGym', function(done) {
            chai.request(server)
                .get('/routines')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('key', userKey)
                .set('namegym', 'error')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Gimnasio no registrado.');
                    done();
                })
        });
        it('should return an error message when trying to GET with an incorrect key', function(done) {
            chai.request(server)
                .get('/routines')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('key', "error")
                .set('nameGym', 'autotest')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.success.should.equal(false);
                    res.body.message.should.equal('Clave del gimnasio incorrecta o inválida.');
                    done();
                })
        });
    });

    describe('POST a new premium routine', function() {

        it('should POST a routine for the given gym', function(done) {
            chai.request(server)
                .post('/routines/newRoutine')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .send({"name": "autotest", "objective": "testear", "exercises": ["autotest1", "autotest2"],
                    "repetitions": [1, 2], "series": [1, 2], "relaxTime": [2, 2]})
                .end(function (err, res) {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Inserción correcta.");
                    done();
                })
        });
        it('should return an error message when trying to POST with an incorrect user or password', function(done){
            chai.request(server)
                .post('/routines/newRoutine')
                .set('user', 'error')
                .set('pwd', 'error')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .send({"name": "autotest", "objective": "testear", "exercises": ["autotest1", "autotest2"],
                    "repetitions": [1, 2], "series": [1, 2], "relaxTime": [2, 2]})
                .end(function(err, res){
                    console.log(res.body);
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it('should return an error message when trying to POST with an empty header', function(done) {
            chai.request(server)
                .post('/routines/newRoutine')
                .send({"name": "autotest", "objective": "testear", "exercises": ["autotest1", "autotest2"],
                    "repetitions": [1, 2], "series": [1, 2], "relaxTime": [2, 2]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cabecera de la petición vacía o incorrecta.');
                    done();
                })
        });
        it('should return an error message when trying to POST with an empty body', function(done) {
            chai.request(server)
                .post('/routines/newRoutine')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cuerpo de la peticion vacío o incorrecto.');
                    done();
                })
        });

        after(function(done) {
            mongoDb.deleteRoutineByName("gpsAdmin", "Gps@1718", "autotest", function(err, result) {
                if(err) {
                    console.log("Error al eliminar las rutinas automaticamente");
                    done();
                } else {
                    console.log("Rutinas borradas correctamente");
                    done();
                }
            })
        })
    });

    describe("PUT a new data collection updating the given routine of a given gym", function() {
        it('should return success when updating a routine correctly', function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .send({"name": "autotest", "objective": "editao", "exercises": ["autotest1", "autotest3"],
                    "repetitions": [1, 2], "series": [1, 2], "relaxTime": [2, 2]})
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Rutina actualizada correctamente.');
                    done();
                })
        });
        it("should return error when trying to put with empty headers", function(done) {
            chai.request(server)
                .put('/routines/update')
                .send({"name": "autotest", "objective": "editao", "relaxTime": 1, "exercises": ["autotest","autotest2"]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cabecera de la peticion vacía o incorrecta.');
                    done();
                })
        });
        it("should return error when trying to put with empty body", function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cuerpo de la peticion vacío o incorrecto.');
                    done();
                })
        });
        it("should return an error when trying to put with incorrect user or password", function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'error')
                .set('pwd', 'error')
                .set('namegym', "autotest")
                .set('key', coachKey)
                .send({"name": "autotest", "objective": "editao", "relaxTime": 1, "exercises": ["autotest","autotest2"]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it("should return an error when trying to put with an incorrect gym", function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "error")
                .set('key', coachKey)
                .send({"name": "autotest", "objective": "editao", "relaxTime": 1, "exercises": ["autotest","autotest2"]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Gimnasio no registrado.');
                    done();
                })
        });
        it("should return an error when trying to put with an incorrect key", function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', "error")
                .send({"name": "autotest", "objective": "editao", "relaxTime": 1, "exercises": ["autotest","autotest2"]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Clave del gimnasio incorrecta o inválida.');
                    done();
                })
        });
        it("should return an error when trying to put with a user key", function(done) {
            chai.request(server)
                .put('/routines/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', "autotest")
                .set('key', userKey)
                .send({"name": "autotest", "objective": "editao", "relaxTime": 1, "exercises": ["autotest","autotest2"]})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Permisos insuficientes.');
                    done();
                })
        })
    });

    /*
     * Delete the previously inserted routine and gym
     */
    after(function(done) {
        mongoDb.deleteRoutineByName("gpsAdmin", "Gps@1718", "autotest", function(err, result){
            if(err){
                console.log("Error al ")
            }
            mongoDb.deleteGymByName("gpsAdmin", "Gps@1718", "autotest", function(err, result){
                done();
            });
        });

    });
});

describe('DBdata', function() {

    before(function(done) {
        mongoDb.insertLastUpdate("gpsAdmin", "Gps@1718", function(err, result){
            if(!err){
                console.log("OK")
            }
            else console.log(err);
            done();
        })
    });

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
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
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
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cabecera de la petición vacía o incompleta.');
                    done();
                })
        })
    });
});

describe('Update', function() {

    var lastUpdate;

    before(function(done) {
        mongoDb.getLastUpdate("gpsAdmin", "Gps@1718", function(err, result) {
            if(!err) {
                lastUpdate = result;
                mongoDb.insertLastUpdate("gpsAdmin", "Gps@1718", function(err, result){
                    if(!err){
                        console.log("OK")
                    }
                    else console.log(err);
                    done();
                });
            }
            else {
                console.log("Error pidiendo lastUpdate");
            }
        });
    });

    describe('GET lastupdate', function(){
        it('should GET the last update date', function(done){
            chai.request(server)
                .get('/update')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .end(function(err, res){
                    res.should.have.status(200);
                    res.body.should.have.property('lastUpdate');
                    res.body.lastUpdate.should.be.a('String');
                    done();
                })
        });
        it('should return an error message when trying to GET with an incorrect user or password', function(done){
            chai.request(server)
                .get('/update')
                .set('user', 'error')
                .set('pwd', 'error')
                .end(function(err, res){
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it('should return an error message when trying to GET with an empty header', function(done) {
            chai.request(server)
                .get('/update')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Cabecera de la petición vacía o incompleta.');
                    done();
                })
        })
    });

    after(function(done) {
        mongoDb.updateLastUpdate("gpsAdmin", "Gps@1718", lastUpdate, function(err, result) {
            if(!err){
                console.log("OK");
            }
            else console.log("Error restaurando update");
            done();
        })
    })
});

describe('Gyms', function(){
    var gymKey;
    var coachGymKey;
    // Insert exercises an gym necessary for the tests
    before(function(done) {
        mongoDb.insertExercise("gpsAdmin", "Gps@1718", "autotest", "autotest", "autotest", "", "autotest", function(err, result) {
            if(err){
                console.log("Error insertando ejercicio primero");
                done();
            }
            else{
                mongoDb.insertExercise("gpsAdmin", "Gps@1718", "autotest2", "autotest2", "autotes2t", "", "autotest2", function(err2, result) {
                    if(err2){
                        console.log("Error insertando ejercicio segundo");
                        done();
                    }
                    else{
                        mongoDb.insertNewGym("gpsAdmin", "Gps@1718", "autotest", function (err, result2, result3) {
                            if(err){
                                console.log("Error insertando gimnasio");
                                done();
                            }
                            else{
                                gymKey = result2;
                                coachGymKey = result3;
                            }
                            done();
                        })
                    }
                })
            }
        })
    });

    describe('POST a new gym', function() {
        it('should POST a new gym and return the set of keys', function(done) {
            chai.request(server)
                .post('/gym/newGym')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .send({nameGym: "autotest"})
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('coachKey');
                    res.body.coachKey.should.be.a('String');
                    res.body.should.have.property('userKey');
                    res.body.userKey.should.be.a('String');
                    done();
                })
        });
        it('should return an error message when trying to POST with an incorrect user or password', function(done){
            chai.request(server)
                .post('/gym/newGym')
                .set('user', 'error')
                .set('pwd', 'error')
                .send({nameGym: "autotest"})
                .end(function(err, res){
                    console.log(res.body);
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Usuario o contraseña incorrectos.');
                    done();
                })
        });
        it('should return an error message when trying to POST with an empty header', function(done) {
            chai.request(server)
                .post('/gym/newGym')
                .send({nameGym: "autotest"})
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Parámetros incompletos.');
                    done();
                })
        });
        it('should return an error message when trying to POST with an empty body', function(done) {
            chai.request(server)
                .post('/gym/newGym')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Parámetros incompletos.');
                    done();
                })
        });
    });



    describe('GET a login attempt outcome', function() {
        it('should return a successful user login attempt', function(done) {
            chai.request(server)
                .get('/gym/login')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', 'autotest')
                .set('key', gymKey)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Credenciales de usuario correctos, bienvenido.");
                    res.body.should.have.property('type');
                    res.body.type.should.equal("user");
                    done();
                })
        });
        it('should return a successful coach login attempt', function(done) {
            chai.request(server)
                .get('/gym/login')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', 'autotest')
                .set('key', coachGymKey)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Credenciales de administrador correctos, bienvenido.");
                    res.body.should.have.property('type');
                    res.body.type.should.equal("admin");
                    done();
                })
        });
        it('should return an unsuccessful login attempt', function(done) {
            chai.request(server)
                .get('/gym/login')
                .set('user', 'gpsAdmin')
                .set('pwd', 'Gps@1718')
                .set('namegym', 'autotest')
                .set('key', "error")
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Credenciales incorrectos.");
                    done();
                })
        });
        it('should return an error message when trying to GET with empty headers', function(done) {
            chai.request(server)
                .get('/gym/login')
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Cabecera de la petición vacía o incorrecta.");
                    done();
                })
        });
        it('should return an error message when trying to GET with incorrect user and/or password', function(done) {
            chai.request(server)
                .get('/gym/login')
                .set('user', 'error')
                .set('pwd', 'error')
                .set('namegym', 'autotest')
                .set('key', coachGymKey)
                .end(function(err, res) {
                    res.should.have.status(404);
                    res.body.should.have.property('success');
                    res.body.success.should.equal(false);
                    res.body.should.have.property('message');
                    res.body.message.should.equal("Usuario o contraseña incorrectos.");
                    done();
                })
        });
    });

    // Delete the previously inserted mock objects
    after(function (done) {
        mongoDb.deleteExerciseByName("gpsAdmin", "Gps@1718", "autotest", function (err, result) {
            if(err){
                console.log("Error borrando ejercicio primero")
                done();
            }
            else{
                mongoDb.deleteExerciseByName("gpsAdmin", "Gps@1718", "autotest2", function (err, result) {
                    if(err) {
                        console.log("Error borrando ejercicio segundo");
                        done();
                    }
                    else{
                        mongoDb.deleteGymByName("gpsAdmin", "Gps@1718", "autotest", function(err, result) {
                            if(err) {
                                console.log("Error borrando gym");
                            }
                            else{
                                console.log("Borrado con exito");
                            }
                            done();
                        })
                    }
                })
            }
        })
    });
});