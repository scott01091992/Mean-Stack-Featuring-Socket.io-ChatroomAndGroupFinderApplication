myApp.factory('user_factory', function($http){

	var factory = {};

	factory.register = function(user, callback){
		$http.post('/user', user).success(function(output){
			callback(output);
		});
	};

	factory.login = function(credentials, callback){
		$http.post('/user/login', credentials).success(function(output){
			callback(output);
		});
	}

	factory.logout = function(callback){
		$http.post('/user/logout').success(function(output){
			callback(output);
		});
	}



	factory.get_friend_requests = function(callback){
		$http.get('/user/friend_requests').success(function(output){
			callback(output);
		});
	}

	factory.get_current_user = function(callback){
		$http.get('/user/current').success(function(output){
			callback(output);
		})
	}

	factory.get_friends = function(id, callback){
		$http.get('/user/friends/'+ id).success(function(output){
			callback(output);
		});
	}

	factory.add_friend = function(id, callback){
		$http.get('/user/friend/add/'+id).success(function(output){
			callback(output);
		});
	}

	factory.get_non_friends = function(callback){
		$http.get('/users/non_friends').success(function(output){
			callback(output);
		});
	}

	factory.remove_friend = function(id, callback){
		$http.post('/user/remove_friend/'+id).success(function(output){
			callback(output);
		});
	}

	factory.rate_user = function(id, rating_id, callback){
		$http.post('/user/update_rating/'+id, {rating_id: rating_id}).success(function(output){
			callback
		});
	}

	factory.accept_request = function(id, callback){
		$http.get('/user/accept_request/'+id).success(function(output){
			callback(output);
		});
	}

	factory.decline_request = function(id, callback){
		$http.get('/user/decline_request/'+id).success(function(output){
			callback(output);
		});
	}

	return factory;
});
