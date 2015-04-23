'use strict';

zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', 'faviconService', 'ngDialog', function ($scope, $routeParams, Message, faviconService, ngDialog) {

  $scope.outlookView = true;
  $scope.query = '';

  $scope.messages = Message.query(function (data) {
    faviconService.badge(data.length);
  });

  $scope.sortTimestamp = function(message) {
    var date = new Date(message.timestamp);
    return date;
  };

  $scope.toggleView = function () {
    $scope.outlookView = !$scope.outlookView
  };

  $scope.showSettings = function () {
    ngDialog.open({
        template: 'partials/settings.html',
        className: 'ngdialog-theme-default',
        controller: 'SettingsCtrl'
    });
  };

  $scope.setMessage = function (messageId) {
    $scope.message = Message.get({ messageId: messageId }, function (data) {
      if (data.body.html === undefined) {
        $scope.showBody = 'Plain';
      } else {
        $scope.showBody = 'HTML';
      }
    });
  };
}]);
