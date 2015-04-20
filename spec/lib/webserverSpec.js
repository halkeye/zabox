var request = require('supertest')

var WebServer = require(__dirname + '/../../lib/webserver');
var Storage = require(__dirname + '/../../lib/storage/test');

var storage = new Storage();

var responses = {
  '/api': ['json'],
  '/api/json': ['messages', 'smtp_settings'],
  '/api/json/messages': [
    { id: 'b5c89620-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'This is my first message', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2007-03-01T13:00:00Z' },
    { id: 'b5c8999-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'This message has no HTML', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2010-03-01T13:00:00Z' }
  ],
  '/api/json/smtp_settings': { messageLimit: 100, hostname: '127.0.0.1', port: 1 },
  '/api/json/messages/b5c89620-665f-42b5-a431-42327d3bff6a': { id: 'b5c89620-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', timestamp: '2007-03-01T13:00:00Z', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], cc: [  ], bcc: [  ], subject: 'This is my first message', body: { plain: "My First Heading\nMy first paragraph.", html: '<!DOCTYPE html> <html> <body> <h1>My First Heading</h1> <p>My first paragraph.</p> </body> </html>' } }
}

describe('WebServer', function() {
  var webserver = new WebServer(0, storage);
  Object.keys(responses).forEach(function(url) {
    describe('GET ' + url, function(){
      it('returns json api', function(done){
        request(webserver.getApp())
          .get(url)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            expect(res.body).toEqual(responses[url]);
            expect(res.status).toEqual(200);
          })
          .expect(200, done);
      })
    });
  });

  describe('GET /app/json/messages/badbadbad', function(){
    it('doesnt returns json api', function(done){
      request(webserver.getApp())
        .get('/app/json/messages/badbadbad')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res) {
          expect(res.body).toEqual('');
          expect(res.status).toEqual(404);
        })
        .expect(404, done);
    })
  });
});
