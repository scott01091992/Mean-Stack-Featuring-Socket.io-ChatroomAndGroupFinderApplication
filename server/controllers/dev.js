var Game = mongoose.model('Games');
var Article = mongoose.model('Articles')

module.exports = (function(){

	return{
		game: function(req, res){
			var game = new Game(req.body);
			game.save(function(err){
				if(err){
					res.json(err);
				}
				else{
					res.json(game);
				}
			});
		},
		article: function(req, res){
			var article = new Article(req.body);
			article.save(function(err){
				if(err){
					res.json(err);
				}
				else{
					res.json(article);
				}
			});
		}
	}
})();