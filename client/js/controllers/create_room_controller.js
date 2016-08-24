myApp.controller('create_room_controller', function($scope, user_factory, game_factory, room_factory, $location){
	console.log("Loading create room controller");
	console.log("Getting current user from session data...");
	user_factory.get_current_user(function(output){
		if(output.error){
			console.log("Error getting user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log("successfully got user from session, storing locally");
			current_user = output;
		}
	});

	console.log("Getting all games...");
	game_factory.get_games(function(output){
		console.log("Adding games to scope");
		$scope.games = output;
	});

	$scope.create_room = function(){
		console.log("Create room button clicked");
		console.log("Creating room...");
		room_factory.create_room(
				{
					_host: current_user._id,
					game: $scope.game,
					size: $scope.size,
					game_style: $scope.game_style,
					age: $scope.age,
					communication_plat: $scope.communication_plat
				}, function(callback){
			if(callback.errors){
				console.log("There was an error creating this room: "+callback.errors);
			}else{
				console.log("successfully created room, redirecting to new room");
				$location.path('/chatroom/'+callback._id);
			}
		})
	}

	$scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}

});
