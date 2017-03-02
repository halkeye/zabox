'use strict';

beforeEach(function () {
  jasmine.addMatchers({
    toEqualData: function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: angular.equals(actual, expected)
          };
        }
      };
    }
  });
});
