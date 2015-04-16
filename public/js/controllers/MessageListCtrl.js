'use strict';

zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', 'SMTPSettings', 'faviconService', function ($scope, $routeParams, Message, SMTPSettings, faviconService) {
  $scope.messages = Message.query(function (data) {
    faviconService.badge(data.length);
  });

  $scope.smtpSettings = SMTPSettings.query();

  $scope.sortTimestamp = function(message) {
    var date = new Date(message.timestamp);
    return date;
  };
}]);
