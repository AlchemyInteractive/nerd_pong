'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Match Schema
 */
var MatchSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	player1Id: {
		type: String,
	},
	player2Id: {
		type: String,
	},
	score1: {
		type: Number,
	},
	score2: {
		type: Number,
	}
});

mongoose.model('Match', MatchSchema);
