var MessageSchema = new mongoose.Schema({

	message: {type: String, required: true, minlength: 1}, 
	_user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}, 
	
}, {timestamps: true});

mongoose.model('Messages', MessageSchema);

