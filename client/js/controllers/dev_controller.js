myApp.controller('dev_controller', function($scope, dev_factory, $location){

	$scope.url = './assets/article_images/';

	$scope.create_game = function(){
		dev_factory.create_game({title: $scope.game_title, genre: $scope.genre}, function(callback){
			console.log(callback);
			$scope.title = '';
			$scope.genre = '';
		})
	}

	$scope.create_article = function(){
		dev_factory.create_article({title: $scope.title, img_url: $scope.url, content: $scope.content}, function(callback){
			console.log(callback);
			$scope.content = '';
			$scope.url = './assets/article_images/';
			$scope.title = '';
		})
	}

});
