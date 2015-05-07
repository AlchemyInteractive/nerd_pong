'use strict';

//games service used for communicating with the articles REST endpoints
angular.module('matches').factory('Matches', ['$resource',
  function($resource) {
    return $resource('matches/:matchId', {
      matchId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

