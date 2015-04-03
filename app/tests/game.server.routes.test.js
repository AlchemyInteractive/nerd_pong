'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Game = mongoose.model('Game'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, game;

/**
 * Game routes tests
 */
describe('Game CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new game
		user.save(function() {
			game = {
				title: 'Game Title',
				content: 'Game Content'
			};

			done();
		});
	});

	it('should be able to save an game if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new game
				agent.post('/games')
					.send(game)
					.expect(200)
					.end(function(gameSaveErr, gameSaveRes) {
						// Handle game save error
						if (gameSaveErr) done(gameSaveErr);

						// Get a list of games
						agent.get('/games')
							.end(function(gamesGetErr, gamesGetRes) {
								// Handle game save error
								if (gamesGetErr) done(gamesGetErr);

								// Get games list
								var games = gamesGetRes.body;

								// Set assertions
								(games[0].user._id).should.equal(userId);
								(games[0].title).should.match('Game Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an game if not logged in', function(done) {
		agent.post('/games')
			.send(game)
			.expect(401)
			.end(function(gameSaveErr, gameSaveRes) {
				// Call the assertion callback
				done(gameSaveErr);
			});
	});

	it('should not be able to save an game if no title is provided', function(done) {
		// Invalidate title field
		game.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new game
				agent.post('/games')
					.send(game)
					.expect(400)
					.end(function(gameSaveErr, gameSaveRes) {
						// Set message assertion
						(gameSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle game save error
						done(gameSaveErr);
					});
			});
	});

	it('should be able to update an game if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new game
				agent.post('/games')
					.send(game)
					.expect(200)
					.end(function(gameSaveErr, gameSaveRes) {
						// Handle game save error
						if (gameSaveErr) done(gameSaveErr);

						// Update game title
						game.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing game
						agent.put('/games/' + gameSaveRes.body._id)
							.send(game)
							.expect(200)
							.end(function(gameUpdateErr, gameUpdateRes) {
								// Handle game update error
								if (gameUpdateErr) done(gameUpdateErr);

								// Set assertions
								(gameUpdateRes.body._id).should.equal(gameSaveRes.body._id);
								(gameUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of games if not signed in', function(done) {
		// Create new game model instance
		var gameObj = new Game(game);

		// Save the game
		gameObj.save(function() {
			// Request games
			request(app).get('/games')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single game if not signed in', function(done) {
		// Create new game model instance
		var gameObj = new Game(game);

		// Save the game
		gameObj.save(function() {
			request(app).get('/games/' + gameObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', game.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an game if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new game
				agent.post('/games')
					.send(game)
					.expect(200)
					.end(function(gameSaveErr, gameSaveRes) {
						// Handle game save error
						if (gameSaveErr) done(gameSaveErr);

						// Delete an existing game
						agent.delete('/games/' + gameSaveRes.body._id)
							.send(game)
							.expect(200)
							.end(function(gameDeleteErr, gameDeleteRes) {
								// Handle game error error
								if (gameDeleteErr) done(gameDeleteErr);

								// Set assertions
								(gameDeleteRes.body._id).should.equal(gameSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an game if not signed in', function(done) {
		// Set game user 
		game.user = user;

		// Create new game model instance
		var gameObj = new Game(game);

		// Save the game
		gameObj.save(function() {
			// Try deleting game
			request(app).delete('/games/' + gameObj._id)
			.expect(401)
			.end(function(gameDeleteErr, gameDeleteRes) {
				// Set message assertion
				(gameDeleteRes.body.message).should.match('User is not logged in');

				// Handle game error error
				done(gameDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Game.remove().exec();
		done();
	});
});
