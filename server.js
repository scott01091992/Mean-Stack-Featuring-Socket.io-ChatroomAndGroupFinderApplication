//modules
var express = require('express');
mongoose = require('mongoose');
uniqueValidator = require('mongoose-unique-validator');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
bcrypt = require('bcryptjs');

var app = express();

app.use(express.static(path.join(__dirname,'./client')));

app.use(bodyParser.json());

app.use(session({
	secret: 'brandon',
	resave: false,
	saveUninitialized: true
}));

require('./server/config/mongoose.js');

require('./server/config/routes.js')(app);
var server = app.listen(6789, function(){
 console.log("listening on port 6789");
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log(socket);
  console.log('user connected, socket id: '+socket.id);

  socket.on('join_room', function(data){
		socket.room = data.room_id;
		socket.join(socket.room);
  	io.sockets.in(socket.room).emit('server_response_join', {response: data});
  });

	socket.on('update_join_room', function(data){
		socket.room = data.room_id;
		socket.join(socket.room);
  	io.sockets.in(socket.room).emit('server_response_update_join', {response: data});
  });

  socket.on('sent_message', function(message){
  	console.log('Message to other users, emiting...');
  	io.sockets.in(socket.room).emit('server_response_message', {response: message});
  });

	socket.on('disconnect', function(){
		console.log('disconnecting user...');
		leave = function(id, user, callback){
			var Room = mongoose.model('Rooms');
			console.log('parameters for leave function: ');
			console.log(id);
			console.log(user);
			console.log('Leave room function activated...');
			console.log('Getting room from db with room id');
			Room.update({"_id": id}, {$pull: {"_users": user._id}}, function(err, room){
				if(err){
					console.log(err);
					console.log('Error removing user from room');
				}else{
						Room.findById(id, function(err, the_room){
							if(err){
								console.log('there was an error finding the room...')
								console.log(err);
							}else if(the_room._users.length < 1){
								console.log('removing room, no one here');
								Room.remove({_id: id}, function(err){
									if(err){
										console.log('there was an error removing this room');
										console.log(err);
									}else{
										console.log('successfully destroyed room');
										callback();
									}
								});
							}else{
								console.log('successfully removed user from the room, returning confirmation');
								console.log(room);
								callback();
							}
						});
				}
			});
		}

		var Users = mongoose.model('Users');
		 console.log('User disconnecting: '+socket.id);
		 console.log(socket.id.substring(2));
		 socketId = socket.id.substring(2);
		 Users.findOne({socket: socketId}, function(err, socket_id_user){
			 if(err){
				 console.log('finding user by socket id error:');
				 console.log(err);
			 }
			 else{
				 	console.log(socket_id_user);
				 	leave(socket_id_user.room, socket_id_user, function(){
						console.log('done');
						io.sockets.in(socket.room).emit('server_response_leave', {response: {name: socket_id_user.username, id: socket_id_user._id}});
						socket.leave(socket.room);
					});
		 	}
		 });
	});

  //all the socket code goes in here!
});
