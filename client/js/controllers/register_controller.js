myApp.controller('register_controller', function($scope, user_factory, $location){
	console.log("Loading register controller");

	$scope.register = function(){
		console.log("Register button clicked");
		console.log("Removing errors and success message from scope");
		$scope.errors = {confirm: {}};
		$scope.success = '';
		//check password input == confirm input
		console.log("Checking if password and confirm hold same values");
		if($scope.password == $scope.confirm){
			// request user be registered to server
			console.log("Password and confirm hold same values, registering user...");
			user = {
				first_name: $scope.first_name,
				last_name: $scope.last_name,
				email: $scope.email,
				username: $scope.username,
				password: $scope.password,
				dob: $scope.dob,
				communication_pref: $scope.communication_pref,
				communication_plat: $scope.communication_plat,
				gamer_style: $scope.gamer_style,
				city: $scope.city,
				state: $scope.state
			}
			user_factory.register(user, function(output){
				//errors returned
				if(output.errors){
					console.log("Error registering user, updating scope errors");
					//update view with errors
					$scope.errors = output.errors;
				}
				//no errors
				else{
					console.log("successfully registered user, redirecting to login");
					$location.path('/login');
				}
			});
		}
		else{
			console.log("Password and confirm do not hold same values, updating scope errors");
			// update view with errors
			$scope.errors.confirm.message = 'The passwords do not match';
		}
	};


});
