
var Articles = mongoose.model('Articles');

module.exports = (function(){

	return{
		index: function(req, res){
			Articles.find({}, function(err, articles){
		        if (err){
		          console.log(err);
		        }else{
		          res.json(articles);
		        }
     		});
		}
	}
})();