zabox.controller('EmailDetailCtrl', ['$scope', '$routeParams', 'Email', function ($scope, $routeParams, Email) {
  $scope.email = Email.get({ emailId: $routeParams.id });
}]);
