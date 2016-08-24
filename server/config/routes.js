var users = require('./../controllers/users.js');

var games = require('./../controllers/games.js')

var genres = require('./../controllers/genres.js');

var articles = require('./../controllers/articles.js');

var rooms = require('./../controllers/rooms.js');

var contact_message = require('./../controllers/contact_message.js');

var rooms = require('./../controllers/rooms.js');

var dev = require('./../controllers/dev.js');

module.exports = function(app){

	app.post('/dev/game', dev.game);
	app.post('/dev/article', dev.article);

	app.post('/user', users.create);
	app.post('/user/login', users.login);
	app.get('/user/current', users.current_user);
	app.get('/users/index', users.index);
	app.get('/users/non_friends', users.non_friends)
	app.post('/user/update_rating/:id', users.update_rating);
	app.get('/user/friend_requests', users.get_friend_requests);
	app.get('/user/accept_request/:id', users.accept_request);
	app.get('/user/decline_request/:id', users.decline_request);

	app.post('/contact/message', contact_message.create);
	app.post('/room/lfg', rooms.lfg);
	app.post('/room', rooms.create);
	app.post('/room/:id', rooms.join);

	app.get('/games', games.index);

	app.get('/room', rooms.index);
	app.get('/room/:id', rooms.profiles);

	app.get('/articles', articles.index);

	app.get('/user/friend/add/:id', users.add_friend);
	app.get('/user/friends/:id', users.friend_index);
	app.post('/user/remove_friend/:id', users.friend_remove);



}
