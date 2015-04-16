zaboxServices.factory('SMTPSettings', ['$resource',
  function($resource){
    return $resource('api/json/smtp_settings', {}, {
      query: {method:'GET'}
    });
  }]);
