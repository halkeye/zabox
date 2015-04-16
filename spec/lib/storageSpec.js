var fs = require('fs');

describe('testing storage engines', function() {
  var storageEngines = {};
  fs.readdirSync(__dirname + '/../../lib/storage/').forEach(function(file) {
    var Storage = require(__dirname + '/../../lib/storage/' + file);
    storageEngines[file.replace('.js', '')] = Storage;
  });
  Object.keys(storageEngines).forEach(function(engine) {
    describe(engine + " Follows basic specs", function() {
      it('blah', function() {
        var storage = new storageEngines[engine]();
        expect(storage).not.toBe(null);
      });
    });
  });

  describe('Memory engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['memory']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: true, maxMessages: 100 });
    });
  });

  describe('Test engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['test']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: true, maxMessages: 100 });
    });
  });

  describe('Sqlite engine', function() {
    it('should expose settings', function() {
      var storage = new storageEngines['sqlite']();
      var settings = storage.settings();
      expect(settings).toEqual({ messageLimit: false });
    });
  });
});
