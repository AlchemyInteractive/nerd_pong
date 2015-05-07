'use strict';

angular.module('matches').controller('MatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Matches', function( $scope, $stateParams, $location, Authentication, Matches ) { 

  
		$scope.create = function() {

			var match = new Matches({
				player1Id: this.player1Id,
				player2Id: this.player2Id,
        score1: this.score1,
        score2: this.score2
			});
			match.$save(function(response) {
        return match
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(match) {
			if (match) {
				match.$remove();

				for (var i in $scope.matches) {
					if ($scope.matches[i] === match) {
						$scope.matches.splice(i, 1);
					}
				}
			} else {
				$scope.match.$remove(function() {
					$location.path('matches');
				});
			}
		};

		$scope.update = function() {
			var match = $scope.match;

			match.$update(function() {
				$location.path('matches/' + match._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
}]);
