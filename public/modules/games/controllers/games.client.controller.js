'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games',
	function($scope, $stateParams, $location, Authentication, Games ) {
    
	    $scope.test = {
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
			
      		$scope.config = $scope.test;
		};

		$scope.initializeScroller = function() {
 		
 		console.log('initializeScroller');
 		if( $scope.config.bracket == undefined ) return;

		  var $dom = $(document),
		      $roundsWrapper = $('.rounds-wrapper'),
		      ROUND_WIDTH = 280,
		      isSwipping = false, // finger/mouse is doing swipe
		      isAnimating = false, // when containers are animating 
		      SWIPE_THRESHOLD = 40,
		      startSwipeX = 0,
		      currentSwipeX = 0,
		      modalIsOpen = false,
		      $modalScore = $('modal-score');

		  $dom
		  .on('mousedown touchstart', function(event){
		    if ( modalIsOpen ) return;
		    isSwipping = true;
		    startSwipeX = ( event.originalEvent.touches ) ? event.originalEvent.touches[0].pageX : event.pageX;
		  })
		  .on('mousemove touchmove', function(event){
		    if ( modalIsOpen || !isSwipping ) return;
		    currentSwipeX = ( event.originalEvent.touches ) ? event.originalEvent.touches[0].pageX : event.pageX;
		    if ( Math.abs( startSwipeX - currentSwipeX ) > SWIPE_THRESHOLD ) {
		      if ( startSwipeX > currentSwipeX ) 
		        swipeLeft();
		      else 
		        swipeRight();
		    }
		  })
		  .on('mouseup touchstop touchend', function(event){
		    isSwipping = false;
		    startSwipeX = currentSwipeX = 0;
		  });

		  function swipeLeft(){
		    if ( isAnimating ) return;      
		    var currentLeft = $roundsWrapper.css('margin-left').replace('px', '');
		    isAnimating = true;
		    if ( currentLeft > -ROUND_WIDTH ) 
		      $roundsWrapper.animate({'margin-left':(-ROUND_WIDTH)+'px'}, 300, function() { isAnimating = false; });
		    else if ( currentLeft > -ROUND_WIDTH*2 ) 
		      $roundsWrapper.animate({'margin-left':(-ROUND_WIDTH*2)+'px'}, 300, function() { isAnimating = false; });
		    else 
		      $roundsWrapper.animate({'margin-left':(-ROUND_WIDTH*3)+'px'}, 300, function() { isAnimating = false; });
		  }

		  function swipeRight(){
		    if ( isAnimating ) return;      
		    var currentLeft = $roundsWrapper.css('margin-left').replace('px', '');
		    isAnimating = true;
		    if ( currentLeft < -ROUND_WIDTH*2 ) 
		      $roundsWrapper.animate({'margin-left':(-ROUND_WIDTH*2)+'px'}, 300, function() { isAnimating = false; });
		    else if ( currentLeft < -ROUND_WIDTH ) 
		      $roundsWrapper.animate({'margin-left':(-ROUND_WIDTH)+'px'}, 300, function() { isAnimating = false; });
		    else 
		      $roundsWrapper.animate({'margin-left':'0px'}, 300, function() { isAnimating = false; });
		  } 
		};

		$scope.refreshRounds = function() {

			var $template = $('.template-player-box'),
				$templateWinner = $('.template-player-winner'),
				$rounds = $('.rounds-wrapper .round'),
				numRounds , numMatches, r, m, count,
				round = null, $roundElem, $matchesWrapper, $matchElem,
				match = null, user1, user2;

			// $.each($rounds, function( index, value ) {
			// 	if ( index == numRounds ) $($rounds[index]).addClass('active');
			// 	else $($rounds[index]).removeClass('active');
			// });
			numRounds = $scope.config.bracket.length;
			for ( r=0; r<numRounds; r++ ) {
				round = $scope.config.bracket[r];
				$roundElem = $($rounds[r]);
				$matchesWrapper = $roundElem.find('.matches-wrapper');
				$matchesWrapper.empty();
				// check each match to find out if round is complete
				numMatches = round.length;
				count = 0;
				for ( m=0; m<numMatches; m++ ) {
					match = round[m];
					
					$matchElem = $template.contents().clone();
					user1 = getUserById(match.player1Id);
					user2 = getUserById(match.player2Id);
					/** make the logic dynamic to handle deeper brackets **/
					if ( r == 0)
						$matchElem.css('height', '80px').css('padding-top', '10px');
					else if ( r == 1)
						$matchElem.css('height', '170px').css('padding-top', '60px');
					else if ( r == 2)
						$matchElem.css('height', '350px').css('padding-top', '150px');
					
					
					// $matchElem.css({'height': (MATCH_HEIGHT * (r+1) + (20*(r+1)))+'px', 'padding-top': (MATCH_PADDING)+'px' })
					$matchElem.find('.player-1 img').attr('src', user1.img);
					$matchElem.find('.player-1 p').text(user1.name);
					$matchElem.find('.vs').text('Table '+(m+1));
					$matchElem.find('.player-2 img').attr('src', user2.img);
					$matchElem.find('.player-2 p').text(user2.name);
					$matchesWrapper.append( $matchElem );
					

					if ( match.winner != "" ) count++;

				}
				// if ( count == numMatches) $roundElem.addClass('active');
				// else $roundElem.removeClass('active');


			}  

			// check if we have a winner
			if ( numRounds > 2 && $scope.config.bracket[2] != '' ) {
				match = $scope.config.bracket[2][0];
				if ( !match )return;
				$roundElem = $($rounds[3]);
				$matchElem = $templateWinner.contents().clone();
				user1 = getUserById(match.winner);
				$matchesWrapper = $roundElem.find('.matches-wrapper');
				$matchElem.find('.winner img').attr('src', user1.img);
				$matchElem.find('.winner p').text(user1.name);
				$matchesWrapper.append( $matchElem );
				$matchElem.css('height', '350px').css('padding-top', '150px');
			}

		};
		
		function getUserById(id){
			for ( var i=0, l=$scope.config.users.length; i<l; i++ ) 
				if ( id == $scope.config.users[i].userId ) 
					return $scope.config.users[i];
			return null;
		}

	}
]);



		



