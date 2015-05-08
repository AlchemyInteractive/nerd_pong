'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games', 'Matches',
    function($scope, $stateParams, $location, Authentication, Games, Matches) {

				// general-purpose fns
				var getUserById = function(arr, id) {
					return R.find(R.propEq('userId', id), arr)
				}

				var randomSorter = function(a, b) {
					return [ -1, 0, 1 ][Math.floor(Math.random() * 3)]
				}

				var shuffle = R.sort(randomSorter)

				// services

        
        $scope.score1;
        $scope.score2;

        $scope.configure = {
            bracket: [
            [
							{ matchId: "m1", player1Id: "p1", player2Id:"p2" },
							{ matchId: "m2", player1Id: "p3", player2Id:"p4" },
							{ matchId: "m3", player1Id: "p5", player2Id:"p6" },
							{ matchId: "m4", player1Id: "p7", player2Id:"p8" },
            ],
            [ ],
            [ ]
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

    $scope.createBracket = function(){
      console.log($scope.config.users);
      if ($scope.config.users.length > 1){
        $scope.config.users = shuffle($scope.config.users);
        $scope.createMatches();
        //$scope.config.started = true;
        $scope.config.$update();
        $scope.initializeUI();
        $scope.refreshRounds();
      } else {
      }
    };

    $scope.createMatches = function(){
      $scope.saveMatchToConfig();
      $scope.createEachMatch();
      console.log($scope.config.bracket);  
    };
  
    $scope.saveMatchToConfig = function(){
      $scope.config.bracket.push( [] );  
      for ( var i=0; i<Math.ceil( $scope.config.users.length/2 ); i++ ){
        var match = new Matches({
          player1Score:"",
          player2Score:"",
          winner:"",
          player1Id:"",
          player2Id:""
        });
        $scope.config.bracket[0].push( match );  
        match.$save();
      }
      $scope.config.$update();
    };

    $scope.createEachMatch = function(){
      var tempArray = $scope.config.users.map(function(obj){return obj});
      for ( var i=0; i<$scope.config.bracket.length; i++ ){
        if ( $scope.config.bracket[0][i].player1Id == "" ){
          var lastUser = tempArray.pop();
          $scope.config.bracket[0][i].player1Id = lastUser.userId;
          console.log('first: ' + lastUser.userId);
        } else if ( $scope.config.bracket[0][i].player2Id == "" ){
          var lastUser = tempArray.pop();
          $scope.config.bracket[0][i].player2Id = lastUser.userId;
          console.log('second: ' + lastUser.userId);
        }
      }
    };

        // check if player in the game
        $scope.checkPlayerInGame = function(user, gameId, game) {

        var strNum = user._id.toString();
        var userArray = game.users.map(function(obj){return obj.userId});
        var locateUser = userArray.indexOf(strNum);

            // if locateUser returns -1 then add to game
          if (locateUser < 0) {
                game.users.push(
          {
            userId: user._id, 
            name: user.providerData.name, 
            img: user.providerData.profile_image_url
          }
        );  
        game.$update();
        console.log(game.users);
            } else {
        // add user to user bracket
          };
        };

    $scope.find = function() {
      $scope.games = Games.query();
    };

        $scope.findOne = function() {
            $scope.game = Games.get({
                gameId: $stateParams.gameId
            });
      return $scope.game;
        };
    
    $scope.initGame = function(){
      $scope.game = Games.get({
        gameId: $stateParams.gameId
      }).$promise.then(function(data){
        $scope.config = data;
				$scope.config.users = $scope.configure.users
				$scope.config.bracket = $scope.configure.bracket
        if (!$scope.config){
          $scope.initializeUI();
          $scope.refreshRounds();
        }
      });
    };

// we should remove the jquery bits from here.. Angular or bust
$scope.initializeUI = function() {

    console.log($scope.config);
    console.log('initializeScroller');

    var $dom = $(document),
        $roundsWrapper = $('.rounds-wrapper'),
        $modalScore = $('#modal-match-score'),
        $backdrop = $('#backdrop'),
        $saveScoreForm = $('#form-save-score');

        $(document).on('mouseup touchstop touchend', '.player-box', {}, function(event){
            var $box = $(event.currentTarget);
            if ( $box.data('round') && $box.data('match') )
                openScoreModal($box.data('round'), $box.data('match'));
        });

				function hideModal() {
						$scope.scoreModalIsOpen = false // this needs a refactor..
            $backdrop.fadeTo("slow" , 0,  function() { $backdrop.hide(); });
            $modalScore.fadeOut('fast',  function() { $modalScore.hide(); });
				}

        $backdrop.on('mouseup touchstop touchend', hideModal);

        $scope.saveScore = function(){
            if ( $modalScore.data('round') && $modalScore.data('match') ) {
                // you have all the info to be able to save to 
                // $scope.config.bracket[round][match];
								var round = $scope.config.bracket[$modalScore.data('round')]
								var match = round[$modalScore.data('match')]
								match.player1Score = $scope.score1
								match.player2Score = $scope.score2
                console.log('p1: ' + $scope.score1 + ', p2: ' + $scope.score2); 
								moveForwardInBracket(round, match)
								closeScoreModal()
            }        
        };

				function moveForwardInBracket(round, match) {
					var winnerId = parseInt(match.player1Score) > parseInt(match.player2Score) ? match.player1Id : match.player2Id
					match.winner = winnerId
					var nextRoundIndex = parseInt($modalScore.data('round')) + 1
					var nextRound = $scope.config.bracket[nextRoundIndex]
					if (!nextRound) return console.log('someone won?') // are we done with the tourny?
					var waitingSlot = nextRound.filter(function(r) { return r.player1Id && !r.player2Id })[0]
					if (waitingSlot) {
						waitingSlot.player2Id = winnerId
					} else {
						nextRound.push({
							matchId: "m4", player1Id: winnerId
						})
					}
					$scope.refreshRounds()
				}

				function closeScoreModal() {
					$scope.scoreModalIsOpen = false
					hideModal()
				}
        
        function openScoreModal(round, match){

						if ($scope.scoreModalIsOpen) return
						$scope.scoreModalIsOpen = true

            console.log('opening modal ~ round index:', round, ' ~ match index:', match);
            $backdrop.fadeTo("fast" , .8);
            $modalScore.data('round', round);
            $modalScore.data('match', match);
            $modalScore.fadeIn('slow');
            var data = $scope.config.bracket[round][match];
            console.log( "DATA:", data);
						$scope.score1 = data.player1Score
						$scope.score2 = data.player2Score
            $modalScore.find('h3.title').text('Table '+(match+1));
            var user1 = getUserById($scope.config.users, data.player1Id),
                user2 = getUserById($scope.config.users, data.player2Id);

						if (!user1 || !user2) return

            $modalScore.find('.player-1 img').attr('src', user1.img);
            $modalScore.find('.player-1 p').text(user1.name);
            $modalScore.find('.player-2 img').attr('src', user2.img);
            $modalScore.find('.player-2 p').text(user2.name);
            
            $modalScore.find('.player-1 img').attr('src', user1.img);
            $modalScore.find('.player-1 p').text(user1.name);
            $modalScore.find('.player-2 img').attr('src', user2.img);
            $modalScore.find('.player-2 p').text(user2.name);

						$scope.$apply()
        }

				// allowing native scrolling.. less code, smoother performance
    };

    $scope.refreshRounds = function() {

        var $template = $('.template-player-box'),
        $templateWinner = $('.template-player-winner'),
        $rounds = $('.rounds-wrapper .round'),
        numRounds , numMatches, r, m, count,
        round = null, $roundElem, $matchesWrapper, $matchElem,
        match = null, user1, user2;
				var heightPerRound = 70
				var heightBuffer = 10

        // $.each($rounds, function( index, value ) {
        //  if ( index == numRounds ) $($rounds[index]).addClass('active');
        //  else $($rounds[index]).removeClass('active');
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
                        user1 = getUserById($scope.config.users, match.player1Id);
                        user2 = getUserById($scope.config.users, match.player2Id);
                        /** make the logic dynamic to handle deeper brackets **/

												if (!user1 && !user2) continue

												// this is to replace the hard-coded stuff underneath.
												// I got rid of the padding requirement by using flexbox in CSS.. but
												// there is more to do here to get the rounds sized correctly
												var height = ((heightPerRound + heightBuffer) * (r + 1)) + (heightBuffer * r)
												$matchElem.css('height', height + 'px') 
                        
                        $matchElem.addClass('round-'+(r+1));
                        $matchElem.addClass('match-'+(m+1));
                        $matchElem.data( 'round', r+'');
                        $matchElem.data( 'match', m+'');
                        // $matchElem.css({'height': (MATCH_HEIGHT * (r+1) + (20*(r+1)))+'px', 'padding-top': (MATCH_PADDING)+'px' })
												if (user1) {
													$matchElem.find('.player-1 img').attr('src', user1.img);
													$matchElem.find('.player-1 p').text(user1.name);
												}

                        $matchElem.find('.vs').text('Table '+(m+1));

												if (user2) {
													$matchElem.find('.player-2 img').attr('src', user2.img);
													$matchElem.find('.player-2 p').text(user2.name);
												}

                        $matchesWrapper.append( $matchElem );
                        

                        if ( match.winner != "" ) count++;

                    }
                    // if ( count == numMatches) $roundElem.addClass('active');
                    // else $roundElem.removeClass('active');


                }  

                // check if we have a winner
                if ( numRounds > 2 && $scope.config.bracket[2] != '' ) {
                    match = $scope.config.bracket[2][0];
                    if ( !match || !match.winner )return;
                    $roundElem = $($rounds[3]);
                    $matchElem = $templateWinner.contents().clone();
                    $matchElem.addClass('round-4');
                    $matchElem.addClass('match-1');
                    $matchElem.data( 'round', 3);
                    $matchElem.data( 'match', 0);

                    user1 = getUserById($scope.config.users, match.winner);
                    $matchesWrapper = $roundElem.find('.matches-wrapper');
                    $matchElem.find('.winner img').attr('src', user1.img);
                    $matchElem.find('.winner p').text(user1.name);
                    $matchesWrapper.append( $matchElem );
                    $matchElem.css('height', '350px').css('padding-top', '150px');
                }

            };

				}
		]
);
