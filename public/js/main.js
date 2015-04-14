var zabox = angular.module('zabox', ['ngRoute', 'zaboxServices']);
var zaboxServices = angular.module('zaboxServices', ['ngResource']);

zabox.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/messages', {
        templateUrl: 'partials/message-list.html',
        controller: 'MessageListCtrl'
      }).
      when('/messages/:messagesId', {
        templateUrl: 'partials/message-detail.html',
        controller: 'MessageDetailCtrl'
      }).
      otherwise({
        redirectTo: '/messages'
      });
  }]);
