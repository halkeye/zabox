'use strict';

zabox.controller('SettingsCtrl', ['$scope', 'SMTPSettings', function ($scope, SMTPSettings) {
  $scope.smtpSettings = SMTPSettings.query();
}]);
