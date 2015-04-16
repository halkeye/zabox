'use strict';

describe( 'Message Detail Controller', function() {

  beforeEach(function () {
    this.setupController('MessageDetailCtrl', {
      routeParams: {
        messageId: 'a233f8d-djfk'
      }
    });
  });

  it( 'should show "HTML" as default', function() {
    expect(scope.showBody).toEqual('HTML');
  });

  it( 'should get "message" using xhr', function() {
    $httpBackend.expectGET('api/json/messages/a233f8d-djfk').
        respond(exampleMsg);
    $httpBackend.flush();
    expect(scope.message).toEqualData(exampleMsg);
  });

});
