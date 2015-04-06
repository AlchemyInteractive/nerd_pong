'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games',
	function($scope, $stateParams, $location, Authentication, Games ) {
     var self = this;
    
     $scope.config = function(){
     return {
       bracket: [
         [
           {matchId: "m1", player1Score: 21, player2Score: 18, winner: "p1", player1Id: "p1", player2Id:"p2"},
           {matchId: "m2", player1Score: 19, player2Score: 21, winner: "p4", player1Id: "p3", player2Id:"p4"},
           {matchId: "m3", player1Score: 17, player2Score: 21, winner: "p6", player1Id: "p5", player2Id:"p6"},
           {matchId: "m4", player1Score: 21, player2Score: 18, winner: "p7", player1Id: "p7", player2Id:"p8"},
         ],
         [
           {matchId: "m5", player1Score: 21, player2Score: 18, winner: "p1", player1Id: "p1", player2Id:"p4"},
           {matchId: "m6", player1Score: 19, player2Score: 21, winner: "p7", player1Id: "p6", player2Id:"p7"},
         ],
         [
           {matchId: "m8", player1Score: 19, player2Score: 21, winner: "p7", player1Id: "p1", player2Id:"p7"},
         ]
       ],
       users: [
      { userId: "p1", name: "p1", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p2", name: "p2", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p3", name: "p3", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p4", name: "p4", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p5", name: "p5", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p6", name: "p6", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p7", name: "p7", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'},
      { userId: "p8", name: "p8", img: 'http://pbs.twimg.com/profile_images/578419242246094848/WcYWKW2W_normal.png'}
      ]
     }      
   };

    $scope.users = [];

		$scope.authentication = Authentication;

		$scope.create = function() {
			var game = new Games({
				title: this.title,
				content: this.content
			});
			game.$save(function(response) {
				$location.path('games/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(game) {
			if (game) {
				game.$remove();

				for (var i in $scope.games) {
					if ($scope.games[i] === game) {
						$scope.games.splice(i, 1);
					}
				}
			} else {
				$scope.game.$remove(function() {
					$location.path('games');
				});
			}
		};

		$scope.update = function() {
			var game = $scope.game;

			game.$update(function() {
				$location.path('games/' + game._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.games = Games.query();
		};

		$scope.findOne = function() {
			$scope.game = Games.get({
				gameId: $stateParams.gameId
			});
		};
  
	}
]);
