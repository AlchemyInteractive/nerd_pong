'use strict';

// Setting up route
angular.module('games').config(['$stateProvider',
	function($stateProvider) {
		// games state routing
		$stateProvider.
		state('listGames', {
			url: '/games',
			templateUrl: 'modules/games/views/list-games.client.view.html'
		}).
		state('createArticle', {
			url: '/games/create',
			templateUrl: 'modules/games/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/games/:articleId',
			templateUrl: 'modules/games/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/games/:articleId/edit',
			templateUrl: 'modules/games/views/edit-article.client.view.html'
		});
	}
]);
