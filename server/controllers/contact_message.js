
var ContactMessage = mongoose.model('Contact_Messages');

module.exports = (function(){

	return{
		index: function(req, res){
			ContactMessage.find({}, function(err, contact_messages){
		        if (err){
		          console.log(err);
		        }else{
		          res.json(contact_messages);
		        }
     		})
		},
		create: function(req, res){
			var message = new ContactMessage(req.body);
			message.save(function(err){
				if(err){
					res.json(err);
				}
				else{
					res.json(message);
				}
			});
		}
	}
})();