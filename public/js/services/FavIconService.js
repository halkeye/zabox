'use strict';

zaboxServices.factory('faviconService', [
  function () {
    var favico = new window.Favico({
      animation: 'fade'
    });

    var badge = function (num) {
      favico.badge(num);
    };
    var reset = function () {
      favico.reset();
    };

    return {
      badge: badge,
      reset: reset
    };
  }]);
