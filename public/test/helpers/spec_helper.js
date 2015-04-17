'use strict';

var scope, ctrl, $httpBackend, location;

var exampleMsg = { id: 'b5c89620-665f-42b5-a431-42327d3bff6a', from: 'Gavin Mogan <gavin@gavinmogan.com>', subject: 'This is my first message', to: [ 'Gavin Mogan <gavin@gavinmogan.com>', 'Sean Everest <sean.b.everest@gmail.com>' ], timestamp: '2007-03-01T13:00:00Z', body: { plain: 'this is a message'} };


beforeEach(function() {
  module('zabox');
  module('zaboxServices');
});

beforeEach(function() {
  this.setupController = function (ctrl_name, options) {
    inject(function(_$httpBackend_, _$location_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      location = _$location_;
      scope = $rootScope.$new();

      var ctrl_data = {
        $scope: scope
      };
      if (options !== undefined && options.routeParams !== undefined) {
        ctrl_data.$routeParams = options.routeParams;
      }

      ctrl = $controller(ctrl_name, ctrl_data);
    });
  }
});
