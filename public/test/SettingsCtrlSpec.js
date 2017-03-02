'use strict';

describe('Settings Controller', function () {
  var scope, $httpBackend;

  beforeEach(function () {
    inject(function (_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();

      var ctrlData = {
        $scope: scope
      };

      $controller('SettingsCtrl', ctrlData);
    });
  });

  it('should get "smtp_settings" using xhr', function () {
    $httpBackend.expectGET('api/json/smtp_settings').respond({ messageLimit: false });
    $httpBackend.flush();
  });
});
