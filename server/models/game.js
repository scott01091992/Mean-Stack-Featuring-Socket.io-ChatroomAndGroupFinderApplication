var GameSchema = new mongoose.Schema({

	title: {type: String, required: true},
	genre: {type: String, required: true}
	
}, {timestamps: true});

mongoose.model('Games', GameSchema);

