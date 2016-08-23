myApp.controller('lfg_controller', function($scope, user_factory, game_factory, room_factory, $location){
  console.log("Loading lfg controller...");

  console.log("getting current user from session...");
  user_factory.get_current_user(function(output){
		if(output.error){
      console.log("error getting current user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log("successfully obtained current user, storing locally");
			current_user = output;
      console.log("Getting all games...");
    	game_factory.get_games(function(output){
    		console.log("Adding games to scope");
    		$scope.games = output;
    	});
		}
	});

  $scope.lfg = function(){
    console.log('lfg button clicked');
    room_factory.lfg({game: $scope.game, gamer_style: $scope.gamer_style}, function(output){
      if(output.errors){
        console.log('error finding room');
        console.log(output.errors);
      }else if(output.results){
        console.log('there was no room for this user, create a room redirect');
        $location.path('/room');
      }
      else{
        console.log(output);
        console.log('found a room for the user!');
        $location.path('/chatroom/'+output.id);
      }
    });
  }

  $scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}



});
