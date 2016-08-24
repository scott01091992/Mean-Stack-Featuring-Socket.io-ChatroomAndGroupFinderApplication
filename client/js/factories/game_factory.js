myApp.factory('game_factory', function($http){

	var factory = {};

	factory.get_games = function(callback){
		$http.get('/games').success(function(output){
			callback(output);
		});
	}

	return factory;
});