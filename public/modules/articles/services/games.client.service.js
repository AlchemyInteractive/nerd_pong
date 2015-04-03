'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('games').factory('Games', ['$resource',
	function($resource) {
		return $resource('games/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
