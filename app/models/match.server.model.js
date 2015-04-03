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
	user1: {
		type: Number,
	},
	user2: {
		type: Number,
	},
	score1: {
		type: Number,
	},
	score2: {
		type: Number,
	}
});

mongoose.model('Match', MatchSchema);
