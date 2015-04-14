var zabox = angular.module('zabox', ['ngRoute', 'zaboxServices', 'ngAnimate', 'ngSanitize']);
var zaboxServices = angular.module('zaboxServices', ['ngResource']);

zabox.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/messages', {
        templateUrl: 'partials/message-list.html',
        controller: 'MessageListCtrl'
      }).
      when('/messages/:messageId', {
        templateUrl: 'partials/message-detail.html',
        controller: 'MessageDetailCtrl'
      }).
      otherwise({
        redirectTo: '/messages'
      });
  }]);
