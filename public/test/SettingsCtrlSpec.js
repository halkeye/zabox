'use strict';

describe( 'Settings Controller', function() {
  var scope, ctrl, $httpBackend, location;

  beforeEach(function() {
      inject(function(_$httpBackend_, _$location_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        location = _$location_;
        scope = $rootScope.$new();

        var ctrl_data = {
          $scope: scope,
        };

        ctrl = $controller('SettingsCtrl', ctrl_data);
      });
  });

  it( 'should get "smtp_settings" using xhr', function() {
    $httpBackend.expectGET('api/json/smtp_settings').respond({ messageLimit: false });
    $httpBackend.flush();
  });

});
