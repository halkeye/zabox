'use strict';

window.exampleMsg = {
  id: 'b5c89620-665f-42b5-a431-42327d3bff6a',
  from: 'Gavin Mogan <gavin@gavinmogan.com>',
  subject: 'This is my first message',
  to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ],
  timestamp: '2007-03-01T13:00:00Z',
  body: { plain: 'this is a message' }
};

beforeEach(function () {
  module('zabox');
  module('zaboxServices');
});
