var zabox = angular.module('zabox', ['ngRoute', 'zaboxServices']);
var zaboxServices = angular.module('zaboxServices', ['ngResource']);

zabox.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/emails', {
        templateUrl: 'partials/email-list.html',
        controller: 'EmailListCtrl'
      }).
      when('/emails/:emailId', {
        templateUrl: 'partials/email-detail.html',
        controller: 'EmailDetailCtrl'
      }).
      otherwise({
        redirectTo: '/emails'
      });
  }]);
