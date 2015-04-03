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
		type: Array,
		default: ''
		round: {
			type: Mixed,
			default: ''
			match: {
				type: Number,
				default: ''
				
			},
			user1: {
				type: Number,
				default: ''
				
			},
			user2: {
				type: Number,
				default: ''
				
			},
			score1: {
				type: Number,
				default: ''
				 
			},
			score2: {
				type: Number,
				default: ''
				 
			},
			winner: {
				type: Number,
				default: ''
				
			}
		}
	}
});

mongoose.model('Game', GameSchema);
