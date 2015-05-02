'use strict';

module.exports = function(app) {
  // Match Routes
	app.route('/matches')
		.get(matches.list)
		.post(users.requiresLogin, matches.create);

	app.route('/matches/:gameId')
		.get(matchces.read)
		.put(users.requiresLogin, matches.update)
		.delete(users.requiresLogin, matches.delete);

	// Finish by binding the game middleware
	app.param('matchId', matches.matchByID);
};
