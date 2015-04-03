'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var Mixed = mongoose.Schema.Types.Mixed;
/**
 * Game Schema
 */
var GameSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	bracket: {
		type: Array
	}
});

mongoose.model('Game', GameSchema);
