var _ = require('underscore');
var Users = mongoose.model('Users');
module.exports = (function(){

	return{
		index: function(req, res){
			console.log("User index function activated");
			console.log("Finding all users...");
			Users.find({}, function(err, users){
		        if (err){
							console.log("There was an error finding all users");
		          console.log(err);
		        }else{
							console.log("Found all users, returning them to factory");
		          res.json(users);
		        }
     		})
		},
		non_friends: function(req, res){
			console.log('users non_friends function activated');
			console.log('getting all user ids in db, storing them in array');
			Users.find({})
			.lean()
			.distinct('_id').exec(function(err, id_array){
				console.log('getting current user with session id...')
				Users.findOne({_id: req.session.user._id}, function(err, current){
					if(err){
						console.log('there was an error getting the user with session id: ');
						console.log(err);
					}else{
						console.log('removing current user id from array of users ids');
						for(var i = 0; i < id_array.length; i++){
							if(id_array[i].toString() == current._id.toString()){
								id_array.splice(i, 1);
								i--;
							}else{
								id_array[i] = id_array[i].toString();
							}
						}
						console.log('removing friends from returned users...')
						for(var q = 0; q < current._friends.length; q++){
							current._friends[q] = current._friends[q].toString();
						}
						id_array = _.difference(id_array, current._friends);
						console.log('getting all users in the left over id_array');
						Users.find({'_id': { $in: id_array}}, function(err, docs){
							if(err){
								console.log('there was an error getting non_friends: ');
								console.log(err);
							}else{
								console.log('successfully obtained non_friends, returning them to factory')
								res.json(docs);
							}
						});
					}
				});
			})
		},
		create: function(req, res){
			console.log("User create function activated");
			console.log("Checking if username already exists...");
			Users.findOne({username: req.body.username}, function(err, user){
				if(user){
					console.log("Username already in db, returning error to factory");
					res.json({errors:{username:{message: 'This username is already in use'}}});
				}
				console.log("Checking if email already exists...");
				Users.findOne({email: req.body.email}, function(err, user){
					if(user){
						console.log("Email already in db, returning error to factory");
						res.json({errors:{email:{message: 'This email is already in use'}}});
					}
					else{
						console.log("Email and username available");
						if(req.body.password){
							console.log("Encrypting password...");
							req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
						}
						console.log("creating new user");
						var user = new Users(req.body);
						console.log("saving user to db...");
						user.save(function(err){
							if(err){
								console.log("Error saving new user");
								res.json(err);
							}
							else{
								console.log("User saved successfully, returning user object to factory");
								res.json(user);
							}
						});
					}
				});
			});
		},
		current_user: function(req, res){
			console.log("User current_user function activated");
			console.log("Is the user logged in?");
			if(req.session.user){
				console.log("User is logged in, findging user by session user id...");
				Users.findOne({_id: req.session.user._id}, function(err, user){
			        if (err){
								console.log("There was an error getting user, returning error to factory");
	 							res.json(err);
			        }else{
								console.log("successfully obtained user from db, sending it to factory");
			          res.json(user);
			        }
     			});
			}else{
				console.log("User was not logged in");
				console.log('destroying session data and sending error to factory');
 				req.session.destroy();
 				res.json({error:{message: 'User not in session'}});
			}
		},
		login: function(req, res){
			console.log("User login function activated");
			console.log("is there a password in body?");
			if(req.body.password){
				console.log("Get user from db using body username...");
				Users.findOne({username: req.body.username}, function(err, user){
					if(err){
						console.log("There was an error getting user from db, returning error to factory");
						res.json(err);
					}
					else if(user){
						console.log("Found user in db.");
						console.log("Comparing Hash to encrypted password");
						if(bcrypt.compareSync(req.body.password, user.password)){
							console.log("Passwords are a match, storing user in session to log them in");
							req.session.user = user;
							console.log("Updating user status to online");
							Users.findOneAndUpdate({_id: req.session.user._id}, {status: "Online"}, function(err, user){
								if(err){
									console.log("Error updating user status, returning error to factory");
									res.json(err);
								}else{
									console.log("successfully logged user in and changed status to online, sending confirmation to factory");
									res.json({success: true});
								}
							});
						}
						else{
							console.log("Passwords did not match, returning errror to factory");
							res.json({message:'Authentication failed'});
						}
					}
					else{
						console.log("No account found, returning error to factory");
						res.json({message: 'No account found'});
					}
				})
			}else{
				console.log("Did not find a passowrd in body data, returning error to factory");
				res.json({message: 'Must have Username and Password'});
			}

		},
		accept_request: function(req, res){
			console.log('user accept_request function activated');
			console.log('removing pending request');
			Users.findOneAndUpdate({_id: req.session.user._id}, {$pull: {_pending: req.params.id}}, function(err, result){
				if(err){
					console.log(err);
				}else{
					console.log('adding friend to user _friends')
					Users.findOneAndUpdate({_id: req.session.user._id}, {$push: {_friends: req.params.id}}, function(err, result2){
						if(err){
							console.log(err);
						}else{
							Users.findOneAndUpdate({_id: req.params.id}, {$push: {_friends: req.session.user._id}}, function(err, result3){
								if(err){
									console.log(err);
								}else{
									console.log('finding user with session user_id... populating...');
									Users.findOne({_id: req.session.user._id}).populate('_friends').exec(function(err, user){
										if(err){
											console.log('There was an error getting user: ');
											res.json(err);
										}else{
											console.log('successfully obtained user and populated, returning user to factory');
											res.json(user);
										}
									});
								}
							});
						}
					});
				}
			})

		},
		decline_request: function(req, res){
			console.log('user decline_request function activated');
			Users.findOneAndUpdate({_id: req.session.user._id}, {$pull: {_pending: req.params.id}}, function(err, result){
				if(err){
					console.log(err);
					res.json(err);
				}else{
					console.log('finding user with session user_id... populating...');
					Users.findOne({_id: req.session.user._id}).populate('_friends').exec(function(err, user){
						if(err){
							console.log('There was an error getting user: ');
							res.json(err);
						}else{
							console.log('successfully obtained user and populated, returning user to factory');
							res.json(user);
						}
					});
				}
			});
		},
		update_rating: function(req, res){
			console.log('user update_rating function activated');
		console.log('getting requestee...');
			Users.findOne({_id: req.params.id}, function(err, result){
				for(var j = 0; j < result._hardcore_rating.length; j++){
					console.log('comparing current user id to requestees ratings '+j);
					if(req.session.user._id == result._hardcore_rating[j]){
						console.log('Already rated hardcore');
						Users.findOneAndUpdate({_id: result._id}, {$pull: {_hardcore_rating: req.session.user._id}}, function(err, complete){
							if(err){
								console.log(err);
							}else{
								console.log('removed hardcore rating');
							}
						});
					}else if(req.session.user._id == result._casual_rating[j]){
						console.log('Already rated casual');
						Users.findOneAndUpdate({_id: result._id}, {$pull: {_casual_rating: req.session.user._id}}, function(err, complete){
							if(err){
								console.log(err);
							}else{
								console.log('removed casual rating');
							}
						});
					}else if(req.session.user._id == result._coop_rating[j]){
						console.log('Already rated coop');
						Users.findOneAndUpdate({_id: result._id}, {$pull: {_coop_rating: req.session.user._id}}, function(err, complete){
							if(err){
								console.log(err);
							}else{
								console.log('removed coop rating');
							}
						});
					}else if(req.session.user._id == result._troll_rating[j]){
						console.log('Already rated troll');
						Users.findOneAndUpdate({_id: result._id}, {$pull: {_troll_rating: req.session.user._id}}, function(err, complete){
							if(err){
								console.log(err);
							}else{
								console.log('removed troll rating');
							}
						});
					}else if(req.session.user._id == result._role_play_rating[j]){
							console.log('Already rated role play');
							Users.findOneAndUpdate({_id: result._id}, {$pull: {_role_play_rating: req.session.user._id}}, function(err, complete){
								if(err){
									console.log(err);
								}else{
									console.log('removed role play rating');
								}
							});
					}
			}
				if(req.body.rating_id == "hardcore_rating"){
					console.log('user rating : hardcore');
					Users.findOneAndUpdate({_id: req.params.id}, {$push: {_hardcore_rating: req.session.user._id}}, function(err, result){
						if(err){
							console.log(err);
							res.json(err);
						}else{
							console.log(result);
							res.json(err);
						}
					});
				}else if(req.body.rating_id == "casual_rating"){
					console.log('user rating : casual');
					Users.findOneAndUpdate({_id: req.params.id}, {$push: {_casual_rating: req.session.user._id}}, function(err, result){
						if(err){
							console.log(err);
							res.json(err);
						}else{
							console.log(result);
							res.json(result);
						}
					});
				}else if(req.body.rating_id == "troll_rating"){
					console.log('user rating : troll');
					Users.findOneAndUpdate({_id: req.params.id}, {$push: {_troll_rating: req.session.user._id}}, function(err, result){
						if(err){
							console.log(err);
							res.json(err);
						}else{
							console.log(result);
							res.json(result);
						}
					});
				}else if(req.body.rating_id == "coop_rating"){
					console.log('user rating : coop');
					Users.findOneAndUpdate({_id: req.params.id}, {$push: {_coop_rating: req.session.user._id}}, function(err, result){
						if(err){
							console.log(err);
							res.json(err);
						}else{
							console.log(result);
						}
					});
				}else if(req.body.rating_id == "role_play_rating"){
					console.log('user rating : roleplay');
					Users.findOneAndUpdate({_id: req.params.id}, {$push: {_role_play_rating: req.session.user._id}}, function(err, result){
						if(err){
							console.log(err);
							res.json(err);
						}else{
							console.log(result);
							res.json(result);
						}
					});
				}
			});
		},
		user_info: function(req, res){
			console.log("User user_info function activated");
			console.log("Finding user by param id...");
			Users.findOne({_id: req.params.id}, function(err, user){
				if(err){
					console.log("Error finding user: ");
					console.log(err);
				}
				else{
					console.log("successfully obtained user, returning it to factory");
					res.json(user);
				}
			})
		},
		logout: function(req, res) {
			console.log("User Logout function activated");
			console.log("Changing user status to offline...");
			Users.findOneAndUpdate({_id: req.session.user._id}, {status: "Offline"}, function(err){
				if(err){
					console.log('Error trying to change status: ');
					console.log(err);
				}else{
					console.log("successfully changed user status");
					console.log("Destroying user session data to log them out");
					req.session.destroy();
					console.log("Redirecting user to index");
		 		 	res.redirect('/');
				}
			});
 		},
 		add_friend: function(req, res){
			console.log("User add_friend function activated");
			console.log("Finding current user in session...");
 			Users.findOne({_id: req.session.user._id}, function(err, user){
 				if(err){
					console.log("Error getting user from session data");
 					console.log(err);
 				}
 				else{
					console.log("successfully obtained user, looking through users _friends");
 					for(var i = 0; i < user._friends.length; i++){
 						if(user._friends[i] == req.params.id){
							console.log("User already has this friend");
 							err = {errors:{message: "Already has this friend"}};
 						}
 					}
 					if(err){
						console.log("Returning error to factory");
 						res.json(err);
 					}
 					else{
						Users.findOne({_id: req.params.id}, function(err, requestee){
							var requested = false;
							for(var u = 0; u < requestee._pending.length; u++){
								if(requestee._pending[u] == user._id){
									console.log('this user has already sent this request');
									requested = true;
								}
							}
							if(requested == true){
								res.json({message: "this request was already sent"});
							}else{
								console.log("User does not have this friend and has not sent this request, adding pending request...");
								var check = false;
								for(var x = 0; x < user._pending.length; x++){
									if(user._pending[x].toString() == req.params.id.toString()){
										check = true;
									}
								}
								if(check == true){
										console.log('friend request already sent');
										res.json({message: 'Request already sent'});
									}else{
										Users.findOneAndUpdate({_id: req.params.id}, {$push: {"_pending": user._id}}, function(err, friend){
											if(err){
												console.log("there was an error finding adding the pending request");
												res.json(err);
											}else{
												console.log("successfully added pending request");
												console.log("returning confirmation to factory");
												res.json({message: "successfully sent pending request"});
											}
										});
									}
								}
						});
					}
 					}
 				});
 			},
		friend_index: function(req, res){
			console.log('User friend index function activated');
			console.log('finding user with session user_id... populating...');
			Users.findOne({_id: req.session.user._id}).populate('_friends').exec(function(err, user){
				if(err){
					console.log('There was an error getting user: ');
					res.json(err);
				}else{
					console.log('successfully obtained user and populated, returning user to factory');
					res.json(user);
				}
			});
		},
		friend_confirm: function(req, res){
				console.log("confirm friend function activated");
				console.log("adding current user to requester _friends...");
				Users.findOneAndUpdate({_id: req.params.id}, {$push: {_friends: req.session.user._id}}, function(err, user){
					if(err){
						console.log("Error adding current user to requester _friends");
						console.log(err);
						console.log('Returning error to factory');
						res.json(err);
					}
					else{
						console.log('successfully added current user to requester _friends');
						console.log('adding requester to current user _friends')
						Users.findOneAndUpdate({_id: req.session.user._id}, {$push: {_friends: req.params.id}}, function(err, result){
							if(err){
								console.log("Error adding requester to current user _friends");
								console.log(err);
								console.log('Returning error to factory');
								res.json(err);
							}
							else{
								console.log('successfully added requester to current user _friends');
								console.log('returning updated current user to factory');
								res.json(result);
							}
					});
				}
			});
 		},
		get_friend_requests: function(req, res){
			Users.findOne({_id: req.session.user._id}).populate('_pending').exec(function(err, user){
				if(err){
					console.log(err);
				}else{
					res.json(user);
				}
			});
		},
		friend_remove: function(req, res){
			console.log('user friend remove function activated');
			console.log('finding user with session id, and removing friend');
			Users.findOneAndUpdate({_id: req.session.user._id}, {$pull: {_friends: req.params.id}}, function(err, result){
				if(err){
					console.log(err);
				}else{
					console.log(result);
					console.log('finding friend, and removing current user from friends');
					Users. findOneAndUpdate({_id: req.params.id}, {$pull: {_friends: req.session.user._id}}, function(err, new_result){
						if(err){
							console.log(err);
						}else{
							console.log(new_result);
							console.log('Getting all friends...');
							console.log('finding user with session user_id... populating...');
							Users.findOne({_id: req.session.user._id}).populate('_friends').exec(function(err, user){
								if(err){
									console.log('There was an error getting user: ');
									res.json(err);
								}else{
									console.log('successfully obtained user and populated, returning user to factory');
									res.json(user);
								}
							});
						}
					});
				}
			})
		}
	}
})();
