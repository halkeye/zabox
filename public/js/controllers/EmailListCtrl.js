zabox.controller('EmailListCtrl', ['$routeParams', 'Email', function ($scope, $routeParams, Email) {
  $scope.emails = Email.query();
}]);
