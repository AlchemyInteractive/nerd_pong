'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Match = mongoose.model('Match'),
    _ = require('lodash');

/**
 * Create a Match
 */
exports.create = function(req, res) {
	var match = new Match(req.body);

	match.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(match);
		}
	});
};

/**
 * Show the current Match
 */
exports.read = function(req, res) {
	res.json(req.match);
};

/**
 * Update a Match
 */
exports.update = function(req, res) {
	var match = req.match;

	match = _.extend(match, req.body);

	match.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(match);
		}
	});
};

/**
 * Delete an Match
 */
exports.delete = function(req, res) {
	var match = req.match;

	match.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(match);
		}
	});
};

/**
 * List of Matches
 */
exports.list = function(req, res) {
	Match.find().sort('-created').populate('user', 'displayName').exec(function(err, matches) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(matches);
		}
	});
};
