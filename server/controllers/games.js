
var Games = mongoose.model('Games');

module.exports = (function(){

	return{
		index: function(req, res){
			Games.find({}, function(err, games){
		        if (err){
		          console.log(err);
		        }else{
		          res.json(games);
		        }
     		});
		}
	}
})();