zaboxServices.factory('Message', ['$resource',
  function ($resource) {
    return $resource('api/json/messages/:messageId', {}, {
      query: {method: 'GET', isArray: true},
      get: {method: 'GET'},
      delete: {method: 'DELETE'}
    });
  }]);
