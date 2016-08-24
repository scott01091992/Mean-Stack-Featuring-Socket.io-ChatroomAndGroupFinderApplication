myApp.factory('room_factory', function($http){

	var factory = {};

	factory.create_room = function(room, callback){
		$http.post('/room', room).success(function(output){
			callback(output);
		});
	}

	factory.get_rooms = function(callback){
		$http.get('/room').success(function(output){
			callback(output);
		});
	}

	factory.join_room = function(id, socket, callback){
		$http.post('/room/'+id, {socket: socket}).success(function(output){
			callback(output);
		});
	}

	factory.leave_room = function(id, callback){
		$http.get('/room/leave/'+id).success(function(output){
			callback(output);
		});
	}

	factory.get_profiles = function(id, callback){
		$http.get('/room/' + id).success(function(output){
			callback(output);
		});
	}

	factory.lfg = function(room, callback){
		$http.post('/room/lfg', room).success(function(output){
			callback(output);
		});
	}

	return factory;
});
