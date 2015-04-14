zabox.controller('MessageListCtrl', ['$scope', '$routeParams', 'Message', function ($scope, $routeParams, Message) {
  $scope.messages = Message.query();
}]);
