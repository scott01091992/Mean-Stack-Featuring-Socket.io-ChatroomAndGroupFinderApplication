myApp.factory('article_factory', function($http){

	var factory = {};

	factory.get_articles = function(callback){
		$http.get('/articles').success(function(output){
			callback(output);
		});
	}

	return factory;
});