zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', function ($scope, $routeParams, Message) {
  $scope.messages = Message.query();

  $scope.sortTimestamp = function(message) {
    var date = new Date(message.timestamp);
    return date;
  };
}]);
