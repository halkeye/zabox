'use strict';

zabox.controller('MessageDetailCtrl', ['$scope', '$routeParams', 'Message', function ($scope, $routeParams, Message) {
  $scope.showBody = 'HTML';

  $scope.message = Message.get({ messageId: $routeParams.messageId }, function (data) {
    if (data.body.html === undefined) {
      $scope.showBody = 'Plain';
    }
  });
}]);
