const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const config = require('config');
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const middleware = require('../middleware/middleware');
const Profile = require('../models/profiles');

cloudinary.config({
	cloud_name: 'snackmanproductions',
	api_key: config.get('cloudinaryApi'),
	api_secret: config.get('cloudinarySecret'),
});

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: 'progressjournal',
	allowedFormats: ['jpg', 'png'],
	transformation: [{ width: 500, height: 500, crop: 'limit' }],
});
const parser = multer({ storage: storage });

//Get User Dashboard
//Private Access
router.get('/', (req, res) => {
	try {
		Profile.findOne({ 'userprofile.username': req.user.username }, (err, foundProfile) => {
			//MATCH PROFILE ID WITH CURRENT USER ID

			if (foundProfile) {
				console.log(foundProfile.avatar.url);
				res.render('dashboard', {
					currentUser: req.user.username,
					user: req.user._id,
					username: req.user.username,
					profile: foundProfile,
				});
			} else {
				res.render('dashboard', {
					currentUser: req.user.username,
					user: req.user._id,
					username: req.user.username,
					profile: null,
				});
			}
		});
	} catch (error) {
		if (error) {
			console.log(error.message);
			return res.status(500).json({ msg: error.message });
		}
	}
});

//Create user profile if this is current user
router.get('/:id/createprofile', middleware.isLoggedIn, middleware.isUser, (req, res) => {
	res.render('createprofile', {
		currentUser: req.user.username,
		user: req.user._id,
	});
});

//GET User Profile
//Private Access
router.get('/:id', middleware.isLoggedIn, middleware.isUser, (req, res) => {
	console.log(req.user.username);
	try {
		Profile.findOne({ 'userprofile.username': req.user.username }, (err, foundProfile) => {
			if (err) throw err;
			else {
				res.render('profile', {
					profile: foundProfile,
					user: req.user._id,
					currentUser: req.user.username,
					username: req.user.username,
				});
			}
		});
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('/profile');
		}
	}
});

//POST ROUTE
//USER PROFILES
//PRIVATE ACCESS
//TODO AVATAR UPLOAD
router.post('/', middleware.isLoggedIn, middleware.isUser, parser.single('profile[avatar]'), async (req, res) => {
	const { username, firstname, lastname, email, facebook, instagram, twitter, bio } = req.body.profile;

	console.log('file:' + typeof req.file.url);
	const profileFields = {};
	if (username) profileFields.username = username;
	if (firstname) profileFields.firstname = firstname;
	if (lastname) profileFields.lastname = lastname;
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

	profileFields.avatar = {
		url: req.file.url,
		id: req.file.public_id,
	};

	try {
		let profile = await Profile.findOne({ userprofile: req.user.id });

		if (profile) {
			profile = await Profile.findOneAndUpdate({ userprofile: req.user.id });
			return res.json(profile);
		}
		profile = new Profile(profileFields);

		Profile.create(profile, (err, createdProfile) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				createdProfile.save();
				req.flash('success', 'Profile was created!');
				res.redirect('/profile');
			}
		});
	} catch (error) {
		if (error) res.status(500).json({ msg: error.message });
	}
});

//Get Edit Profile Page
//Private Access
router.get('/:id/editprofile', middleware.isLoggedIn, middleware.isUser, (req, res) => {
	Profile.findOne({ 'userprofile.username': req.user.username }, (err, foundProfile) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/:id');
		} else {
			res.render('editprofile', {
				profile: foundProfile,
				currentUser: req.user.username,
				user: req.user._id,
			});
		}
	});
});

//Edit Profile Route
//Private Access
//figure out how to update social
router.put('/:id', middleware.isLoggedIn, middleware.isUser, parser.single('profile[avatar]'), async (req, res) => {
	const query = { 'userprofile.username': req.user.username };
	const { username, firstname, lastname, email, bio, facebook, twitter, instagram } = req.body.profile;
	const update = {
		username,
		firstname,
		lastname,
		email,
		bio,
	};
	update.social = {
		facebook,
		twitter,
		instagram,
	};

	update.avatar = {
		url: req.file.url,
		id: req.file.public_id,
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
				avatar: {
					url: update.avatar.url,
					id: update.avatar.id,
				},
			},
		},
		{ upsert: true, new: true },
		(err, editedProfile) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('/:id/editprofile');
			} else {
				req.flash('success', 'Your profile was updated!');
				res.redirect('/profile/');
			}
		}
	);
});


module.exports = router;
