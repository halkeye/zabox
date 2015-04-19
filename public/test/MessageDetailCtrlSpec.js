'use strict';

describe( 'Message Detail Controller', function() {
  var scope, ctrl, $httpBackend, location;

  beforeEach(function() {
      inject(function(_$httpBackend_, _$location_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        location = _$location_;
        scope = $rootScope.$new();

        var ctrl_data = {
          $scope: scope,
          $routeParams: {
            messageId: 'a233f8d-djfk'
          }
        };

        ctrl = $controller('MessageDetailCtrl', ctrl_data);
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

  it( 'should show "Plain" when HTML is undefined', function() {
    $httpBackend.expectGET('api/json/messages/a233f8d-djfk').
        respond(exampleMsg);
    $httpBackend.flush();
    expect(scope.showBody).toEqual('Plain');
  });

  it( 'should show not found when message does not exist', function() {
    $httpBackend.expectGET('api/json/messages/a233f8d-djfk').
        respond(404,'');
    $httpBackend.flush();
    expect(location.url()).toEqual('/404');
  });

});
