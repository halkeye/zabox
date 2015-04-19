'use strict';

zabox.controller('MessageDetailCtrl', ['$scope', '$routeParams', '$location', 'Message', function ($scope, $routeParams, $location, Message) {
  $scope.showBody = 'HTML';

  $scope.message = Message.get({ messageId: $routeParams.messageId }, function (data) {
    if (data.body.html === undefined) {
      $scope.showBody = 'Plain';
    }
  }, function (header) {
    $location.path('/404');
  });
}]);
