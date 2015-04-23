'use strict';

zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', 'faviconService', 'ngDialog', 'ZaboxService', function ($scope, $routeParams, Message, faviconService, ngDialog, ZaboxService) {

  $scope.outlookView = ZaboxService.outlookView;
  $scope.query = '';

  $scope.messages = Message.query(function (data) {
    faviconService.badge(data.length);
  });

  $scope.sortTimestamp = function(message) {
    var date = new Date(message.timestamp);
    return date;
  };

  $scope.toggleView = function () {
    ZaboxService.outlookView = !ZaboxService.outlookView;
    $scope.outlookView = ZaboxService.outlookView;
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
