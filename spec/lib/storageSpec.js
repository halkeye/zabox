/* globals require: false, describe: false, beforeEach: false, it: false, expect: false */
require('should');
describe('testing storage engines', function () {
  var storageEngines = require('../../lib/storage').allStorages();
  it('allStorages should contain all storages', function () {
    Object.keys(storageEngines).sort().should.eql(['memory', 'sqlite', 'test']);
  });

  Object.keys(storageEngines).forEach(function (engine) {
    describe(engine + ' Follows basic specs', function () {
      it('blah', function () {
        var storage = new storageEngines[engine]();
        storage.should.be.ok();
      });
      it('has description', function () {
        storageEngines[engine].description.should.be.ok();
        storageEngines[engine].description.should.not.be.empty();
      });
      it('overriding options works', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();
        var settings = storage.settings();
        settings.messageLimit.should.eql(5);
      });
      it('messages over limit get trimmed', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();
        var messages = [
          { id: 'abc-123-456-1', body: { plain: 'foo1' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo' },
          { id: 'abc-123-456-2', body: { plain: 'foo2' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo' },
          { id: 'abc-123-456-3', body: { plain: 'foo3' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', bcc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'], to: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'] },
          { id: 'abc-123-456-4', body: { html: '<b>hi</b>', plain: 'foo4' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', bcc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'] },
          { id: 'abc-123-456-5', body: { plain: 'foo5' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', cc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'] },
          { id: 'abc-123-456-6', body: { plain: 'foo6' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', to: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'] },
          { id: 'abc-123-456-7', body: { plain: 'foo7' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['Head: 1'] }
        ];
        return Promise.all(
          messages.map(function (message) { return storage.store(message); })
        ).then(function () {
          return storage.all();
        }).then(function (results) {
          results.length.should.eql(5);
          results.slice(-5).should.eql(messages.slice(-5));
        });
      });
      it('get specific message', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();
        var message = { id: 'abc-723-456-7', body: { plain: 'foo7' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['blah blah'] };
        return storage.store(message)
          .then(function () { return storage.get(message.id); })
          .then(function (result) { message.should.eql(result); });
      });
      it('delete specific message', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();
        var message = { id: 'abc-723-456-7', body: { plain: 'foo7' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['blah blah'] };
        return storage.store(message)
          .then(function () { return storage.delete(message.id); })
          .then(function (deleteResult) { deleteResult.should.eql(true); })
          .then(function () { return storage.all(); })
          .then(function (results) {
            var arr = results.filter(function (msg) { return msg.id === message.id; });
            arr.should.eql([]);
          });
      });
      it('delete all messages', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();
        var message = { id: 'abc-723-456-7', body: { plain: 'foo7' }, timestamp: '2007-03-01T13:00:00Z', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['blah blah'] };
        storage.store(message)
          .then(function () { return storage.deleteAll(); })
          .then(function (deleteResult) { deleteResult.should.eql(true); })
          .then(function () { return storage.all(); })
          .then(function (results) {
            results.should.eql([]);
          });
      });
      it('get missing message', function () {
        var storage = new storageEngines[engine]({ messageLimit: 5 });
        storage.should.be.ok();

        return storage.get('asd0891o3iewqdsai')
          .then(
            function () { throw new Error('Shouldnt find a result'); },
            function (err) { err.should.be.ok(); }
          );
      });
    });
  });

  describe('Memory engine', function () {
    it('should expose settings', function () {
      var storage = new storageEngines.memory(); // eslint-disable-line new-cap
      var settings = storage.settings();
      settings.should.eql({ messageLimit: 100 });
    });
  });

  describe('Test engine', function () {
    it('should expose settings', function () {
      var storage = new storageEngines.test(); // eslint-disable-line new-cap
      var settings = storage.settings();
      settings.should.eql({ messageLimit: 100 });
    });
  });

  describe('Sqlite engine', function () {
    it('should expose settings', function () {
      var storage = new storageEngines.sqlite(); // eslint-disable-line new-cap
      var settings = storage.settings();
      settings.should.eql({ messageLimit: false, filename: ':memory:' });
    });
  });
});
