zabox.controller('MessageDetailCtrl', ['$scope', '$routeParams', 'Message', function ($scope, $routeParams, Message) {
  $scope.message = Message.get({ messageId: $routeParams.id });
}]);
