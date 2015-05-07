'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	matches = require('../../app/controllers/matches.server.controller');

module.exports = function(app) {
  // Match Routes
	app.route('/matches')
		.get(matches.list)
		.post(users.requiresLogin, matches.create);

	app.route('/matches/:matchId')
		.get(matches.read)
		.put(users.requiresLogin, matches.update)
		.delete(users.requiresLogin, matches.delete);

	// Finish by binding the game middleware
	app.param('matchId', matches.matchByID);
};
