myApp.controller('chatroom_controller', function($rootScope, $route, $routeParams, $scope, user_factory, room_factory, $location){
	console.log("Loading chatroom controller");

	user_factory.get_current_user(function(output){
		console.log('Launch get user from user factory');
		if(output.error){
			console.log('Get user returned error, redirecting to login');
			$location.path('/login');
		}
		else{
			console.log('Get user did not return error, set output to current_user');
			current_user = output;
			console.log('Connect to socket io');
			socket = io.connect();
			console.log(socket);
			socket.on('connect', function() {
  			//ensures a connection is established and an id has been assigned
  			socketId = socket.id;
				console.log('Launch join room from room factory passing in room id as parameter');
				room_factory.join_room($routeParams.id, socketId, function(output){
					if(output.redirect == true){
						$location.path('/home');
					}
					else if(output.errors){
						console.log('Join room returned error, redirecting to login');
						$location.path('/login');
					}else{
						console.log('Join room did not return error, setting $scope.room to output');
						if(output.inRoom){
							$scope.room = output.room;
						}else{
							$scope.room = output;
						}

						console.log('Build current users mini profile and set it to userprofile variable');
						userprofile = "<div class='mini_profile' id='"+ current_user._id +"'><ul class='list-unstyled'><li><span class='profile_key'>User:</span>" + current_user.username + "</li><li><span class='profile_key'>Style:</span>" + current_user.gamer_style + "</li><li><span class='profile_key'>Comms:</span>" + current_user.communication_pref + "</li><li><section class='flat push_up'><button class='click_button add_friend_profile_button' ng-click='add_friend(" + current_user._id + ")'>Add Friend</button></section></li></ul></div>";

						console.log('getting all profiles from db')
						room_factory.get_profiles($routeParams.id, function(output){
							console.log('here is what came back from getting profiles:');
							console.log(output);
							for(var i = 0 ; i < output.length; i++){
								console.log(output[i]._id);
								console.log(current_user._id);
								if(output[i]._id == current_user._id){
									output.splice(i,1);
								}
							}
							$scope.profiles = output;
						});

						console.log($scope.room);
						if(output.inRoom == true){
							console.log('user already in room');
							socket.emit('update_join_room', {name: current_user.username, profile: userprofile, room_id: $routeParams.id});
						}else{
							//user joins room emit
							console.log('user was not in room, emit join_room and send userprofile to all users in room');
							socket.emit('join_room', {name: current_user.username, profile: userprofile, room_id: $routeParams.id});
						}

						$scope.$on('$routeChangeStart', function(){
							console.log('route changing, disconnect socket');
  						socket.emit('disconnect', {room_id: $routeParams.id});
 						});

						//user sends message emit
						$('form').submit(function (){
							console.log('Message form submitted');
							message = $('#message').val();
							console.log('Emitting message to all users in room');
						socket.emit("sent_message", {name: current_user.username, message: message});
						return false;
						});

						//sever response to user join
						socket.on('server_response_join', function (data){
							console.log('Server emits that user has joined room');
							$('#chatroom').append("<p>"+data.response.name + ' has joined the room</p>');
							console.log('Adding users miniprofile to page');
							$('#profile').append(data.response.profile);
						});

						//sever response to user join
						socket.on('server_response_update_join', function (data){
							console.log('Server emits that user has joined room');
							$('#chatroom').append("<p>"+data.response.name + ' has joined the room</p>');
						});

						//server response to user message
						socket.on('server_response_message', function (data){
							console.log('Server emits message from user, update chatroom with message');
							$('#chatroom').append("<p>"+data.response.name + " says: " + data.response.message+"</p>");
							$('#message').val('');
						});

						//server response to user leave
						socket.on('server_response_leave', function (data){
							console.log('Sever emits that a user has left the room, update chatroom');
							$('#chatroom').append("<p>"+data.response.name + ' has left the room</p>');
							console.log('Removing mini profile for user leaving room');
							$('#'+data.response.id).attr("disabled", true);
							$('#'+data.response.id).html("Pending");
						});
					}
				});
			});
		}
	});

	$scope.add_friend = function(id){
		console.log('Add friend button clicked, activating user_factory add friend passing id from mini profile');
		user_factory.add_friend(id);
		$("#profile_id"+id).remove();
	}

	$scope.logout = function(){
		user_factory.logout(function(callback){
			if(callback){
				$location.path('/home');
			}
		});
	}

});
