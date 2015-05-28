'use strict';

describe( 'Message List Controller', function() {
  var scope, ctrl, $httpBackend, location;

  beforeEach(function() {
      inject(function(_$httpBackend_, _$location_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        location = _$location_;
        scope = $rootScope.$new();

        var ctrl_data = {
          $scope: scope,
        };

        ctrl = $controller('MessageListCtrl', ctrl_data);
      });
  });

  it( 'should get "messages" using xhr', function() {
    $httpBackend.expectGET('api/json/messages').
        respond([exampleMsg]);
    $httpBackend.flush();
    expect(scope.messages).toEqualData(
        [exampleMsg]);
  });

  it( 'should delete messages', function() {
    $httpBackend.expectGET('api/json/messages').
        respond([exampleMsg]);
    $httpBackend.flush();
    $httpBackend.expectDELETE('api/json/messages').
        respond(200, '');
    scope.deleteAllMessages();
    $httpBackend.flush();
    expect(scope.messages).toEqualData([]);
  });

});
