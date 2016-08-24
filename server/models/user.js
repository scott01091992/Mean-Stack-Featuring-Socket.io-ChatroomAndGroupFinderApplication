var UserSchema = new mongoose.Schema({

	status: {type: String},

	first_name: {type: String, required: [true, "First Name field cannot be empty"]},
	last_name: {type: String, required: [true, "Last Name field cannot be empty"]},
	username: {type: String, required: [true, 'Username field cannot be empty'], minlength: [5, 'Username must be at least 5 characters long']},
	password: {type: String, required: [true, 'Password field cannot be empty'], minlength: [8, 'Password must be at least 8 characters long']},

	city: {type: String, required: [true, "City field cannot be empty"]},
	state: {type: String, required: [true, "State field cannot be empty"]},

	dob: {type: String, required: [true, "Birth date field cannot be empty"]},

	communication_pref: {type: String, required: [true, "Must have a communication preference"]},
	communication_plat: {type: String},
	gamer_style: {type: String, required: [true, "Must select a gamer style"]},

	_genres: [{type: mongoose.Schema.Types.ObjectId, ref:'Genres'}],
	_other_genres: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genres'}],
	_games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Games'}],
	_other_games: [{type: mongoose.Schema.Types.ObjectId, ref: 'Games'}],

	_pending: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],

	_hardcore_rating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_role_play_rating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_casual_rating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_coop_rating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_troll_rating: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],

	room: {type: String},
	socket: {type: String}

}, {timestamps: true});

mongoose.model('Users', UserSchema);
