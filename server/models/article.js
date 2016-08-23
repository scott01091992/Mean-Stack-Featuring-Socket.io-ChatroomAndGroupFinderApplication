var ArticleSchema = new mongoose.Schema({

	title: {type: String, required: true},
	content: {type: String, required: true}, 
	img_url: {type: String, required: true}

}, {timestamps: true});

mongoose.model('Articles', ArticleSchema);

