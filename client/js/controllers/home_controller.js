myApp.controller('home_controller', function($scope, $location, $route, article_factory, user_factory){
	console.log("Loading home controller..");

	console.log("getting all articles...");
	article_factory.get_articles(function(callback){
		console.log("successfully obtined articles, storing in scope");
		$scope.articles = callback;
	});

});
