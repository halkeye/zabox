zabox.controller('EmailListCtrl', ['$scope', '$routeParams', 'Email', function ($scope, $routeParams, Email) {
  $scope.emails = Email.query();
}]);
