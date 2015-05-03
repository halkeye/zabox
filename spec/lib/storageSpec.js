var fs = require('fs');

describe('testing storage engines', function() {
  var storageEngines = require('../../lib/storage').allStorages();
  it ('allStorages should contain all storages', function() {
    expect(Object.keys(storageEngines).sort()).toEqual(['memory', 'sqlite', 'test']);
  });

  Object.keys(storageEngines).forEach(function(engine) {
    describe(engine + " Follows basic specs", function() {
      it('blah', function() {
        var storage = new storageEngines[engine]();
        expect(storage).not.toBe(null);
      });
      it('has description', function() {
        expect(storageEngines[engine].description).toBeDefined();
        expect(storageEngines[engine].description).not.toBe(null);
      });
      it('overriding options works', function() {
        var storage = new storageEngines[engine]({ messageLimit: 5});
        expect(storage).not.toBe(null);
        var settings = storage.settings();
        expect(settings.messageLimit).toEqual(5);
      });
      it('messages over limit get trimmed', function(cb) {
        var storage = new storageEngines[engine]({ messageLimit: 5});
        expect(storage).not.toBe(null);
        var messages = [
          {id: 'abc-123-456-1', body: { plain: "foo1" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo'},
          {id: 'abc-123-456-2', body: { plain: "foo2" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo'},
          {id: 'abc-123-456-3', body: { plain: "foo3" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', bcc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com'], to: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com']},
          {id: 'abc-123-456-4', body: { html: '<b>hi</b>', plain: "foo4" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', bcc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com']},
          {id: 'abc-123-456-5', body: { plain: "foo5" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', cc: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com']},
          {id: 'abc-123-456-6', body: { plain: "foo6" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', to: ['zabox@gavinmogan.com', 'gavin@gavinmogan.com']},
          {id: 'abc-123-456-7', body: { plain: "foo7" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['Head: 1']}
        ];
        messages.forEach(function(message) {
          storage.store(message);
        });

        storage.all().done(function(results) {
          expect(results.length).toBe(5);
          [5,4,3,2,1].forEach(function(idx) {
            var actual = results[results.length-(idx-1)];
            var expected = messages[messages.length-(idx-1)];
            expect(actual).toEqual(expected);
          });
          cb();
        });
      });
      it('get specific message', function(cb) {
        var storage = new storageEngines[engine]({ messageLimit: 5});
        expect(storage).not.toBe(null);
        var message = {id: 'abc-723-456-7', body: { plain: "foo7" }, timestamp: "2007-03-01T13:00:00Z", from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'yo', raw: ['blah blah']};
        storage.store(message);

        storage.get(message.id).done(function(result) {
          expect(message).toEqual(result);
          cb();
        });
      });
      it('get missing message', function(cb) {
        var storage = new storageEngines[engine]({ messageLimit: 5});
        expect(storage).not.toBe(null);

        storage.get("asd0891o3iewqdsai").then(cb.fail, cb);
      });
    });
  });

  describe('Memory engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['memory']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: 100 });
    });
  });

  describe('Test engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['test']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: 100 });
    });
  });

  describe('Sqlite engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['sqlite']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: false, filename: ':memory:' });
    });
  });
});
