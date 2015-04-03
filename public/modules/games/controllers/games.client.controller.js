'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games',
	function($scope, $stateParams, $location, Authentication, Games ) {
    
    $scope.config = function(){
      return {
        bracket: [
          [
            {matchId: 1934980, player1Score: 21, player2Score: 18, winner: 1230, player1Id: 1230, player2Id:2340},
            {matchId: 1934981, player1Score: 19, player2Score: 21, winner: 2341, player1Id: 1231, player2Id:2341},
            {matchId: 1934982, player1Score: 17, player2Score: 21, winner: 2342, player1Id: 1232, player2Id:2342},
            {matchId: 1934983, player1Score: 21, player2Score: 18, winner: 1233, player1Id: 1233, player2Id:2343},
            {matchId: 1934984, player1Score: 21, player2Score: 18, winner: 2344, player1Id: 1234, player2Id:2344},
            {matchId: 1934985, player1Score: 17, player2Score: 21, winner: 2345, player1Id: 1235, player2Id:2345},
            {matchId: 1934986, player1Score: 10, player2Score: 21, winner: 2346, player1Id: 1236, player2Id:2346},
            {matchId: 1934987, player1Score: 21, player2Score: 18, winner: 1237, player1Id: 1237, player2Id:2347}
          ],
          [
            {matchId: 1934988, player1Score: 21, player2Score: 18, winner: 1230, player1Id: 1230, player2Id:2341},
            {matchId: 1934989, player1Score: 19, player2Score: 21, winner: 2341, player1Id: 1231, player2Id:2341},
            {matchId: 1934990, player1Score: 17, player2Score: 21, winner: 2342, player1Id: 1232, player2Id:2342},
            {matchId: 1934991, player1Score: 21, player2Score: 18, winner: 1233, player1Id: 1233, player2Id:2343}
          ]
        ],
        users: [
      
        ]
      }      
    };

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
