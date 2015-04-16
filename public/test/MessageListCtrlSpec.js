'use strict';

describe( 'Message List Controller', function() {

  beforeEach(function () {
    this.setupController('MessageListCtrl');
  });

  it( 'should get "messages" using xhr', function() {
    $httpBackend.expectGET('api/json/messages').
        respond([exampleMsg]);
    $httpBackend.flush();
    expect(scope.messages).toEqualData(
        [exampleMsg]);
  });

});
