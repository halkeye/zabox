zaboxServices.factory('Email', ['$resource',
  function($resource){
    return $resource('api/emails/:emailId.json', {}, {
      query: {method:'GET', isArray:true},
      get: {method:'GET'}
    });
  }]);
