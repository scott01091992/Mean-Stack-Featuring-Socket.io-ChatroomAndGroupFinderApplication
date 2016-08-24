myApp.controller('friends_controller', function($scope, user_factory, $location){
	console.log("Loading friends controller");
	console.log("Getting current user from seesion...");
	user_factory.get_current_user(function(output){
		if(output.error){
			console.log("Error getting user, redirecting to login");
			$location.path('/login');
		}
		else{
			console.log("successfully obtained user from session, storing locally");
			current_user = output;

			console.log("getting friends of current user...");
			user_factory.get_friends(current_user._id, function(callback){
				console.log("successfully obtained friends, storing friends in scope");
				$scope.friends = callback._friends;
			})

			console.log('getting all users for search results');
			user_factory.get_non_friends(function(output){
				console.log('got all users from db');
				console.log(output);
				$scope.all_users = output;
			});

			console.log('getting friend requests');
			user_factory.get_friend_requests(function(output){
				console.log(output);
				$scope.friend_requests = output._pending;
			});
		}
	});

	$scope.add_friend = function(id, index){
		console.log('add friend button clicked, adding friend...')
		user_factory.add_friend(id, function(output){
			if(output.message){
				$('#add_friend_button_'+index).attr("disabled", true);
				$('#add_friend_button_'+index).html("Pending");
				console.log('friend added, disabling add friend button');
			}else{
				console.log('something went wrong: ')
				console.log(output);
			}
		});
	}

	$scope.remove_friend = function(id){
		console.log('remove button clicked, removing friend....')
		user_factory.remove_friend(id, function(callback){
			console.log(callback);
			$scope.friends = callback._friends;
		});
	}

	$scope.accept_request = function(id, idx){
		console.log('accept request button clicked');
		$('#friend_button_accept'+ idx).attr("disabled", true);
		$('#friend_button_accept'+ idx).html("Accepted");
		$('#friend_button_decline'+ idx).remove();
		user_factory.accept_request(id, function(callback){
			$scope.friends = callback._friends;
		});
	}

	$scope.decline_request = function(id, idx){
		console.log('decline request button clicked');
		$('#friend_button_decline'+ idx).attr("disabled", true);
		$('#friend_button_accept'+ idx).html("Declined");
		$('#friend_button_decline'+ idx).remove();
		user_factory.decline_request(id, function(callback){
			$scope.friends = callback._friends;
		});
	}

	$scope.gamer_type = {};

	$scope.radio_change = function(id, rating_id){
		console.log(id);
		console.log(rating_id);
		user_factory.rate_user(id, rating_id, function(callback){
			console.log(callback);
		});
	}

	$scope.show_details = function(index){
		$('#rating_id_'+index).slideToggle();
	}

	$scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}

});
