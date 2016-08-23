myApp.controller('contact_controller', function($scope, user_factory, message_factory, $location){
	console.log("Loading contact controller");

	user_factory.get_current_user(function(output){
		console.log("Getting current user from session");
		if(output.error){
			console.log("Error getting user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log('User was found, setting private var current_user to output');
			current_user = output;
		}
	});

	$scope.send = function(){
		console.log("Contact message button clicked");
		console.log("Saving message...");
		message_factory.contact_message({message: $scope.message, _user: current_user._id}, function(callback){
			if(callback.errors){
				console.log("There was an error saving this message: " + callback.errors);
				$scope.error = {message: "We are sorry, there was an error processing this request"};
			}
			else{
				console.log('successfully saved message');
				$scope.message = '';
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
