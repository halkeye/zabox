'use strict';

describe('Message List Controller', function () {
  var scope, $httpBackend;

  beforeEach(function () {
    inject(function (_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();

      var ctrlData = {
        $scope: scope
      };

      $controller('MessageListCtrl', ctrlData);
    });
  });

  it('should get "messages" using xhr', function () {
    $httpBackend.expectGET('api/json/messages')
        .respond([window.exampleMsg]);
    $httpBackend.flush();
    expect(scope.messages).toEqualData(
        [window.exampleMsg]);
  });

  it('should delete messages', function () {
    $httpBackend.expectGET('api/json/messages')
        .respond([window.exampleMsg]);
    $httpBackend.flush();
    $httpBackend.expectDELETE('api/json/messages')
        .respond(200, '');
    scope.deleteAllMessages();
    $httpBackend.flush();
    expect(scope.messages).toEqualData([]);
  });
});
