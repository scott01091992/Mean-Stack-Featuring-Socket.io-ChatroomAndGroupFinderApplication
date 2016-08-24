var RoomSchema = new mongoose.Schema({

	_users: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true}],
	_messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Messages'}],
	game: {type: String, required: true},
	size: {type: String, required: true},
	game_style: {type: String, required: true},
	age: {type: String, required: true},
	communication_plat: {type: String, required: true}

}, {timestamps: true});

mongoose.model('Rooms', RoomSchema);
