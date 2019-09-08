const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const ProfileSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
	},
	lastname: {
		type: String,
	},
	email: {
		type: String,
	},
	avatar: {
		id : {
			type:String
		},
		url: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now,
	},
	userprofile: {
		id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		username: String,
	},
	posts: [],
	todos: [],
	goals: [],
	social: {
		facebook: {
			type: String,
		},
		twitter: {
			type: String,
		},
		instagram: {
			type: String,
		},
	},
	bio: {
		type: String,
	},
});

ProfileSchema.plugin(passportLocalMongoose);

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
