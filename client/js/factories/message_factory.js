myApp.factory('message_factory', function($http){

	var factory = {};

	factory.contact_message = function(message, callback){
		$http.post('/contact/message', message).success(function(output){
			callback(output);
		});
	}

	return factory;
});