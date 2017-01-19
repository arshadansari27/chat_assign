var dbURI    = 'mongodb://localhost/sandbox-chat-db', 
    expect   = require('chai').expect, 
    mongoose = require('mongoose'), 
    MessageRepo = require('../../models/message'), 
    clearDB  = require('mocha-mongoose')(dbURI, {noClear: true});

console.log('[*]', MessageRepo);
describe("Spec for message model", function() {
  before(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbURI, done);
  });

  before(function(done) {
    clearDB(done);
  });

  it("can be saved", function(done) {
    MessageRepo.postMessage({name: 'Arshad Ansari', username: 'arshadansari', password: 'testing'})
    .then(function() {
        done();
    })
    .catch(function(err) { done(err) } );
  });

  it("can save another", function(done) {
    UserRepo.createOrUpdate({name: 'Lalit Pal', username: 'lalitpal', password: 'testing'})
    .then(function() {
        done();
    })
    .catch(function(err) { done(err) } );
  });

  it("can be listed", function(done) {
     UserRepo.getAll({}).then(function(users){
        console.log('[*] -> ', users);
        expect(users).to.have.length(2);
        done();
     }).catch(function(error) {
        done(error);
     });
  });

});
