const { format } = require('date-fns');
const express = require('express');
const router = express.Router();
const { genId } = require('../helpers/idGen');
const middleware = require('../middleware/middleware');
const Day = require('../models/day');
const Profile = require('../models/profiles');

//Index page
//private access
//TODO redo pagination
router.get('/', middleware.isLoggedIn, async (req, res, next) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });

	try {
		console.log(foundProfile ? foundProfile.posts : 'No profile');

		res.render('index', {
			title: 'Progress Journal',
			days: foundProfile ? foundProfile.posts : [],
			noPosts: foundProfile ? foundProfile.posts.length : 0,
			user: req.user._id,
			username: req.user.username,
			currentUser: req.user.username,
		});
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//Create a new post form
//Private
router.get('/new', middleware.isLoggedIn, middleware.isUser, async (req, res, next) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	if (!foundProfile) {
		req.flash('error', 'You must create a profile to create posts!');
		res.redirect('back');
	}
	res.render('new', { title: 'new Route', user: req.user._id, currentUser: req.user.username });
});

//Create the post
//Access private
router.post('/', middleware.isLoggedIn, middleware.isUser, async (req, res, next) => {
	const { mood, title, text } = req.body.day;

	const dayPostFields = {};

	if (mood) dayPostFields.mood = mood;
	if (title) dayPostFields.title = title;
	if (text) dayPostFields.text = text;

	dayPostFields.date = format(new Date(), 'EEEEEE MMMM do');

	dayPostFields.author = {
		id: req.user._id,
		username: req.user.username,
	};

	dayPostFields.id = genId();

	try {
		const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });

		const post = await new Day(dayPostFields);

		Day.create(post, async (err, newPost) => {
			if (err) {
				console.log(err);
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				foundProfile.posts.unshift(newPost);
				await newPost.save();
				await foundProfile.save();
				console.log(Day);
				req.flash('success', 'New Post Added!');
				res.redirect('/api/days');
			}
		});
	} catch (error) {
		if (error) {
			console.log(error.message);
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//Get a user's post
//Access Private
router.get('/:id', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundDay = await Day.findOne({ id: req.params.id });

	if (foundDay.author.id.equals(req.user._id)) {
		console.log(`this found day ${foundDay.author}`);
		res.render('show', {
			day: foundDay,
			user: req.user._id,
			username: req.user.username,
			currentUser: req.user.username,
		});
	} else {
		req.flash('error', 'Sorry, you do not have permission to view this post!');
		res.redirect('/api/days');
	}
});

//Get Editable Post
//Acess Private
router.get('/:id/edit', middleware.isLoggedIn, middleware.isUser, async (req, res, next) => {
	const foundDay = await Day.findOne({ id: req.params.id });

	try {
		res.render('edit', { day: foundDay, title: 'edit', user: req.user._id, currentUser: req.user.username });
	} catch (error) {
		req.flash('error', error.message);
		req.redirect('back');
	}
});

//Edit Post
//Access Private
router.put('/:id', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundDay = await Day.findOne({ id: req.params.id });
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	const { mood, title, text } = req.body.day;
	const editedPost = foundProfile.posts
		.filter(post => {
			return post.id === req.params.id;
		})
		.map(post => {
			return foundProfile.posts.indexOf(post);
		});
	foundProfile.posts[editedPost].mood = mood;
	foundProfile.posts[editedPost].title = title;
	foundProfile.posts[editedPost].text = text;

	const editedPosts = foundProfile.posts;
	try {
		await foundDay.updateOne({ $set: { mood, title, text } });
		await foundDay.save();
		await foundProfile.updateOne({ $set: { posts: editedPosts } });
		await foundProfile.save();
		req.flash('success', 'Successfully Edited Post!');
		res.redirect('/api/days');
	} catch (error) {
		console.log(error.message);
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//Delete User Post
//Private Access
router.put('/:id/remove', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	const filteredRes = foundProfile.posts.filter(post => {
		return post.id !== req.params.id;
	});

	try {
		await foundProfile.updateOne({ $set: { posts: filteredRes } });
		await foundProfile.save();
		Day.findOneAndRemove({ id: req.params.id }, async err => {
			if (err) {
				console.log(err);
				req.flash('error', err.message);
				res.redirect('/:id');
			} else {
				await foundProfile.save();
				req.flash('success', 'Successfully Deleted Post.');
				res.redirect('/api/days');
			}
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('/:id');
	}
});

module.exports = router;
