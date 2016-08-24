var Room = mongoose.model('Rooms');
var Users = mongoose.model('Users');

module.exports = (function(){

	return{
		 create: function(req, res){
			console.log('Create room function called');
			console.log('Creating new room');
			var room = new Room(req.body);
			console.log('Save room to mongo');
			room.save(function(err){
				if(err){
					console.log('There was an error saving room: '+ err);
					res.json(err);
				}
				else{
					console.log('successfully saved room');
					console.log('Add host to the room');
					Room.findOneAndUpdate({_id: room._id}, {$set: {_host: req.session.user._id}}, function(err, room){
						if(err){
							console.log('There was an error adding host to room: '+err);
							res.json(err);
						}else{
								console.log('Sending back room object to factory');
								res.json(room);
						}
					});
				}
			});
		},
		lfg: function(req, res){
			console.log('room lfg function activated');
			console.log('getting all rooms');
			Room.find({game: req.body.game}, function(err, rooms){
				if(err){
					console.log('there was an error getting all users:');
					console.log(err);
				}else{
					console.log('successfully got rooms...')
					console.log(rooms);
					console.log('populating users in rooms...');
					Users.populate(rooms, {path: '_users', model:'Users'} ,function(err, rooms_pop){
						if(err){
							console.log('there was an error populating users');
							console.log(err);
						}else{
							console.log('calculating room scores...');
							var room_scores = [];
							for(var z = 0; z < rooms_pop.length; z++){
								console.log('checking room '+z);
								var room_score = 0;

								for(var y = 0; y < rooms_pop[z]._users.length; y++){
									console.log('checking user '+y+' in room '+z);
									var sum = 0;
									sum += rooms_pop[z]._users[y].hardcore_rating.length;
									sum += rooms_pop[z]._users[y].role_play_rating.length;
									sum += rooms_pop[z]._users[y].casual_rating.length;
								  sum += rooms_pop[z]._users[y].coop_rating.length;
									sum += rooms_pop[z]._users[y].troll_rating.length;

									console.log('room sum is '+sum);
									var avg;
									console.log('gamer style is:'+req.body.gamer_style);
									if(req.body.gamer_style == "Hardcore"){
										console.log('gamer style is hardcore...');
										avg = rooms_pop[z]._users[y].hardcore_rating.length/sum;
									}else if(req.body.gamer_style == "Casual"){
										console.log('gamer style is casual...');
										avg = rooms_pop[z]._users[y].casual_rating.length/sum;
									}else if(req.body.gamer_style == "Role Play"){
										console.log('gamer style is role play...');
										avg = rooms_pop[z]._users[y].role_play_rating.length/sum;
									}else if(req.body.gamer_style == "Co-op"){
										console.log('gamer style is co op...');
										avg = rooms_pop[z]._users[y].coop_rating.length/sum;
									}else if(req.body.gamer_style == "Troll"){
										console.log('gamer style is troll...');
										avg = rooms_pop[z]._users[y].troll_rating.length/sum;
									}

									console.log('room avg score is '+avg);
									room_score += avg
								}
								room_score = room_score/rooms_pop[z]._users.length;

								console.log(room_scores);

								room_scores.push({id: rooms_pop[z]._id, score: room_score});
							}
							var min = 0;
							var best_room_id;

							console.log('checking for best room match...');

							for(var v = 0; v < room_scores.length; v++){
								if(room_scores[v].score > min){
									min = room_scores[v].score;
									best_room_id = room_scores[v].id;
								}
							}

							console.log('best room score was: '+min);
							console.log('best room id is: '+best_room_id);

							if(min == 0){
								console.log('no rooms for this user');
								res.json({results: "there are no rooms available"});
							}else{
								console.log('got a room for the user!');
								res.json({id: best_room_id});
							}
						}
					});
				}
			});
		},
		index: function(req, res){
			console.log('Room index function called: getting all rooms');
			Room.find({}, function(err, rooms){
		        if (err){
							console.log('There was an error with finding all rooms and populating the _host: '+err);
		          res.json(err);
		        }else{
							console.log('successfully obtained all rooms and populated _host, returning object to factory');
		          res.json(rooms);
		        }
     		});
		},
		join: function(req, res){
			console.log('Room join function called: adding user to room');
			console.log('Check if user is in session');
			if(req.session.user){
				console.log('User is in session');
				console.log('Getting room using room id from param');
				Room.findOne({_id: req.params.id},function(err, room){
					if(err){
						console.log('Error finding room: '+err);
						res.json(err);
					}else{
						console.log('Found room');
						console.log('Populating room _users');
						Users.populate(room, {path: '_users', model: "Users"}, function(err, userroom2){
							if(err){console.log('Error populating users: '+err);}
								console.log('updating users socket information');
								console.log(req.body);
								console.log('here is the socket info that was sent through ^^^^^^^^');
								Users.findOneAndUpdate({_id: req.session.user._id}, {socket: req.body.socket}, function(err, user){
									if(err){console.log('error updaing socket info');}
									else{console.log('successfully updated socket info');}
								});
								var	inRoom = false;
								console.log('Checking each user to see if this user is already in the room');
								for(var i = 0; i < userroom2._users.length; i++){
									if(userroom2._users[i]._id == req.session.user._id){
										console.log('user is already in the room');
										inRoom = true;
										break;
									}
								}
								if(inRoom == true){
									console.log('User is already in room, returning the room to the factory');
									userroom2.message = "this is a message";
									res.json({inRoom: true, room: userroom2});
								}
								else{
									console.log('User was not in the room, adding them to the room');
									Room.findByIdAndUpdate({_id: req.params.id}, {$push:{_users: req.session.user._id}}, function(err, finalroom){
										if(err){
											console.log('There was an error pushing user id into the users array: '+err);
											res.json(err);
										}else{
											console.log('updating user info to new room')
											Users.findOneAndUpdate({_id: req.session.user._id},{room: req.params.id}, function(err, room_updated_user){
												if(err){
													console.log('error updaing user room id:')
													console.log(err);
												}
												else{
													console.log('no errors updating user room id, user returned:')
													console.log(room_updated_user);
												}
											});
											console.log('successfully added user to the room, populating _users');
											Users.populate(finalroom, {path: '_users', model:'Users'} ,function(err, finalroom2){
												if(err){console.log('Error populating _users: '+err);}
													console.log('successfully populated room, returning to factory');
													res.json(finalroom);
											});
										}
									});
								}
							});
							}
				});
			}else{
				console.log('User is not in session: return message object as err');
				res.json({errors: {message: "not logged in"}});
			}
		},
		profiles: function(req, res){
			console.log('get all profiles function called');
			console.log('finding users with room id:' + req.params.id);
			Users.find({room: req.params.id}, function(err, profiles){
		        if (err){
							console.log('there was an error getting all profiles');
		          console.log(err);
		        }else{
							console.log('no errors, sending profiles back to factory')
		          res.json(profiles);
		        }
     	});
		}
	}

})();
