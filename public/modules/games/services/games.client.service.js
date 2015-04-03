'use strict';

//games service used for communicating with the articles REST endpoints
angular.module('games').factory('Games', ['$resource',
	function($resource) {
		return $resource('games/:gameId', {
			gameId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
