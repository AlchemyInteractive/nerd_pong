'use strict';

angular.module('games').controller('GamesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Games', 'Matches',
    function($scope, $stateParams, $location, Authentication, Games, Matches) {
        
        $scope.score1;
        $scope.score2;

        $scope.configure = {
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
        $scope.config.users = $scope.shuffle($scope.config.users);
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
        if (!$scope.config){
          $scope.initializeUI();
          $scope.refreshRounds();
        }
      });
    };

$scope.initializeUI = function() {

    console.log($scope.config);
    console.log('initializeScroller');

    var $dom = $(document),
        $roundsWrapper = $('.rounds-wrapper'),
        ROUND_WIDTH = 280,
        isSwipping = false, // finger/mouse is doing swipe
        isAnimating = false, // when containers are animating 
        SWIPE_THRESHOLD = 40,
        startSwipeX = 0,
        currentSwipeX = 0,
        modalIsOpen = false,
        $modalScore = $('#modal-match-score'),
        $backdrop = $('#backdrop'),
        $saveScoreForm = $('#form-save-score');

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
            /* maybe...  maybe not...
            // handle as click if we didn't scroll
                if ( 
                    Math.abs( startSwipeX - currentSwipeX ) > SWIPE_THRESHOLD &&
                    !modalIsOpen 
                ) {
                    openScoreModal();
            }
            */
            startSwipeX = currentSwipeX = 0;
        });

        $(document).on('mouseup touchstop touchend', '.player-box', {}, function(event){
            var $box = $(event.currentTarget);
            if ( $box.data('round') && $box.data('match') )
                openScoreModal($box.data('round'), $box.data('match'));
        });

        $backdrop.on('mouseup touchstop touchend', function(){
            $backdrop.fadeTo("slow" , 0,  function() { $backdrop.hide(); });
            $modalScore.fadeOut('fast',  function() { $modalScore.hide(); });
        });

        $scope.saveScore = function(){
            alert('TO DO! ' + $modalScore.data('round') + ' match: ' + $modalScore.data('match'));
            if ( $modalScore.data('round') && $modalScore.data('match') ) {
                // you have all the info to be able to save to 
                // $scope.config.bracket[round][match];
                console.log('p1: ' + $scope.score1 + ', p2: ' + $scope.score2); 
            }        
        };
        
        function openScoreModal(round, match){
            console.log('opening modal ~ round index:', round, ' ~ match index:', match);
            $backdrop.fadeTo("fast" , .8);
            $modalScore.data('round', round);
            $modalScore.data('match', match);
            $modalScore.fadeIn('slow');
            var data = $scope.config.bracket[round][match];
            console.log( "DATA:", data);
            $modalScore.find('h3.title').text('Table '+(match+1));
            var user1 = $scope.getUserById(data.player1Id),
                user2 = $scope.getUserById(data.player2Id);
            $modalScore.find('.player-1 img').attr('src', user1.img);
            $modalScore.find('.player-1 p').text(user1.name);
            $modalScore.find('.player-2 img').attr('src', user2.img);
            $modalScore.find('.player-2 p').text(user2.name);
            
            $modalScore.find('.player-1 img').attr('src', user1.img);
            $modalScore.find('.player-1 p').text(user1.name);
            $modalScore.find('.player-2 img').attr('src', user2.img);
            $modalScore.find('.player-2 p').text(user2.name);
                        
        }

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
                        user1 = $scope.getUserById(match.player1Id);
                        user2 = $scope.getUserById(match.player2Id);
                        /** make the logic dynamic to handle deeper brackets **/
                        if ( r == 0)
                            $matchElem.css('height', '80px').css('padding-top', '10px');
                        else if ( r == 1)
                            $matchElem.css('height', '170px').css('padding-top', '60px');
                        else if ( r == 2)
                            $matchElem.css('height', '350px').css('padding-top', '150px');
                        
                        $matchElem.addClass('round-'+(r+1));
                        $matchElem.addClass('match-'+(m+1));
                        $matchElem.data( 'round', r+'');
                        $matchElem.data( 'match', m+'');
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
                    $matchElem.addClass('round-4');
                    $matchElem.addClass('match-1');
                    $matchElem.data( 'round', 3);
                    $matchElem.data( 'match', 0);

                    user1 = $scope.getUserById(match.winner);
                    $matchesWrapper = $roundElem.find('.matches-wrapper');
                    $matchElem.find('.winner img').attr('src', user1.img);
                    $matchElem.find('.winner p').text(user1.name);
                    $matchesWrapper.append( $matchElem );
                    $matchElem.css('height', '350px').css('padding-top', '150px');
                }

            };
    
            $scope.getUserById = function(id){
                for ( var i=0, l=$scope.config.users.length; i<l; i++ ) 
                    if ( id == $scope.config.users[i].userId ) 
                        return $scope.config.users[i];
                    return null;
                }
  $scope.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

            }
        ]
    );
