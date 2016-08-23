myApp.controller('profile_controller', function($scope, user_factory, $location){
	console.log("Loading profile controller");

	console.log("Getting current user from session...");
	user_factory.get_current_user(function(output){
		if(output.error){
			console.log("error getting user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log("successfully obtained user, storing locally");
			current_user = output;
			console.log("Storing first name in scope");
			$scope.user = output;

			total_rating = output._hardcore_rating.length + output._casual_rating.length + output._role_play_rating.length + output._coop_rating.length + output._troll_rating.length;

			hcR = (80*(output._hardcore_rating.length/total_rating));
			CR = (80*(output._casual_rating.length/total_rating));
			CoR = (80*(output._coop_rating.length/total_rating));
			RpR = (80*(output._role_play_rating.length/total_rating));
			TR = (80*(output._troll_rating.length/total_rating));

			$('#hardcore_bar').css("height", hcR+"%");
			$('#casual_bar').css("height", CR+"%");
			$('#coop_bar').css("height", CoR+"%");
			$('#roleplay_bar').css("height", RpR+"%");
			$('#troll_bar').css("height", TR+"%");
		}
	});

	$scope.save_changes = function(){
		if($scope.password == $scope.confirm){
			factory.save_changes(
				{
					city: $scope.city,
					state: $scope.state,
					password: $scope.password,
					communication_pref: $scope.communication_pref,
					communication_plat: $scope.communication_plat,
					gamer_style: $scope.gamer_style
				}
			)
		}else{

		}

	}

	$scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}


});
