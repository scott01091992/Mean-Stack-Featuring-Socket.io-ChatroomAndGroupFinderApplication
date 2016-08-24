myApp.controller('discussions_controller', function($scope, room_factory, user_factory, $location){
	console.log("Loading discussions_controller..");
	console.log("Getting current user from session");
	user_factory.get_current_user(function(output){
		if(output.error){
			console.log("There was an error getting current user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log('successfully retrieved current user, storing locally');
			current_user = output;
		}
	});

	console.log("Getting all rooms..");
	room_factory.get_rooms(function(callback){
		console.log("successfully retrieved all rooms, adding rooms to scope");
		$scope.rooms = callback;
	});

	$scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}

});
