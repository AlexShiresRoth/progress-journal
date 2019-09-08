const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const Profile = require('../models/profiles');
//TODO figure out how to match profile id with user ids
// Profile Route
//Public access
router.get('/', middleware.isLoggedIn, (req, res) => {
	try {
		Profile.find({}, async (err, foundProfile) => {
			if (err) throw err.message;
			const response = await foundProfile;
			return res.json(response);
		});
	} catch (error) {
		req.flash('error', 'Internal Server Error'), res.redirect('back');
	}
});

router.get('/:id', middleware.isLoggedIn, middleware.isUser, (req, res, next) => {
	try {
		Profile.find(req.params.id, (err, foundProfile) => {
			//need to match here!
			if (foundProfile.userprofile.id.equals(req.user._id)) {
				return res.status(200).json(foundProfile);
			}
		});
	} catch (error) {
		if (error) {
			return res.status(500).json({ msg: error.message });
		}
	}
});

//POST Route 
//Create new profile for registered user
//Private
router.post('/', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	//do this
	const { username, firstname, lastname, avatar, email } = req.body.profile;
	const profileFields = {};
	if (username) profileFields.username = username;
	if (firstname) profileFields.firstname = firstname;
	if (lastname) profileFields.lastname = lastname;
	if (avatar) profileFields.avatar = avatar;
	if (email) profileFields.email = email;
	if (bio) profileFields.bio = bio;

	profileFields.social = {};
	if (facebook) profileFields.social.facebook = facebook;
	if (instagram) profileFields.social.instagram = instagram;
	if (twitter) profileFields.social.twitter = twitter;

	profileFields.userprofile = {
		id: req.user.id,
		username: req.user.username,
	};
	try {
		let profile = await Profile.findOne({ userprofile: req.user.id });

		if (profile) {
			profile = await Profile.findOneAndUpdate({ userprofile: req.user.id });
			return res.json(profile);
		}
		profile = new Profile(profileFields);

		Profile.create(profile, (err, createdProfile) => {
			if (err) throw error;
			else {
				createdProfile.save();
				res.json(createdProfile);
			}
		});
	} catch (error) {
		if (error) res.status(500).json({ msg: error.message });
	}
});

//Edit Profile Route
//Private Access
router.put('/:id', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const query = { 'userprofile.username': req.user.username };
	const { username, firstname, lastname, avatar, email, bio, facebook, twitter, instagram } = req.body.profile;
	const update = {
		username,
		firstname,
		lastname,
		avatar,
		email,
		bio,
	};
	update.social = {
		facebook,
		twitter,
		instagram,
	};
	await Profile.findOneAndUpdate(
		query,
		{
			$set: {
				social: update.social,
				username: update.username,
				firstname: update.firstname,
				lastname: update.lastname,
				avatar: update.avatar,
				email: update.email,
				bio: update.bio,
			},
		},
		{ upsert: true, new: true },
		(err, editedProfile) => {
			if (err) {
				res.status(500).json({ msg: err.message });
			} else {
				res.json(editedProfile);
			}
		}
	);
});

module.exports = router;
