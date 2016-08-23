myApp.controller('login_controller', function($scope, user_factory, $location){
	console.log("Loading login controller");

	$scope.login = function(){
		console.log("Login button clicked");
		console.log("Logging in user...");
		credentials = {
			username: $scope.username,
			password: $scope.password
		}
		user_factory.login(credentials, function(callback){
			if(callback.success == true){
				console.log("User successfully logged in, redirecting to profile");
				$location.path('/profile');
			}
			else{
				console.log("Error logging in user, storing errors in scope");
				$scope.error = callback;
			}
		});
	}

});
