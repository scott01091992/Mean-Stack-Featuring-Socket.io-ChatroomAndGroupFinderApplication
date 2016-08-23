myApp.factory('dev_factory', function($http){

	var factory = {};

	factory.create_game = function(game, callback){
		$http.post('/dev/game', game).success(function(output){
			callback(output);
		});
	}

	factory.create_article = function(article, callback){
		$http.post('/dev/article', article).success(function(output){
			callback(output);
		});
	}

	return factory;
});