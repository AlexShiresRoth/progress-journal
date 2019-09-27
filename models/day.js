const mongoose = require('mongoose');

const daysSchema = new mongoose.Schema({
	day: String,
	date: {
		type: String,
		default: Date.now,
	},
	mood: String,
	text: String,
	title: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
});

const Day = mongoose.model('Day', daysSchema);

module.exports = Day;
