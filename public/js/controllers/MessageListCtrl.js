'use strict';

zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', 'faviconService', function ($scope, $routeParams, Message, faviconService) {
  $scope.messages = Message.query(function (data) {
    faviconService.badge(data.length);
  });

  $scope.sortTimestamp = function(message) {
    var date = new Date(message.timestamp);
    return date;
  };
}]);
