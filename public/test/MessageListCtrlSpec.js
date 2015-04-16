'use strict';

describe( 'Message List Controller', function() {

  beforeEach(function () {
    this.setupController('MessageListCtrl');
  });

  it( 'should get "messages" using xhr', function() {
    $httpBackend.expectGET('api/json/messages').
        respond([exampleMsg]);
    $httpBackend.expectGET('api/json/smtp_settings').respond({ messageLimit: false });
    $httpBackend.flush();
    expect(scope.messages).toEqualData(
        [exampleMsg]);
  });

});
