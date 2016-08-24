var ContactMessageSchema = new mongoose.Schema({

	message: {type: String, required: true, minlength: 5}, 
	_user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true}, 
	
}, {timestamps: true});

mongoose.model('Contact_Messages', ContactMessageSchema);

