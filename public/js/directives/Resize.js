'use strict';

zabox.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {

            scope.third = function () {
                return {
                    'height': ((newValue.h - 70)/3) + 'px'
                };
            };

            scope.twothird = function () {
                return {
                    'height': (((newValue.h - 70)/3)*2) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    };
});
