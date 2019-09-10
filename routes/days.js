const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const Day = require('../models/day');
const Profile = require('../models/profiles');

//Index page
//private access
router.get('/', middleware.isLoggedIn, async (req, res, next) => {
	let perPage = 4;
	let pageQuery = parseInt(req.query.page);
	let pageNumber = pageQuery ? pageQuery : 1;
	try {
		await Day.find({})
			.skip(perPage * pageNumber - perPage)
			.limit(perPage)
			.exec((err, days) => {
				if (err) {
					req.flash('error', err.message);
					res.redirect('/');
				}
				Day.count().exec((err, count) => {
					if (err) {
						console.log(err);
						req.flash('error', err.message);
						res.redirect('/');
					} else {
						res.render('index', {
							title: 'Progress Journal',
							days: days,
							current: pageNumber,
							pages: Math.ceil(count / perPage),
							noPosts: days.length,
							user: req.user._id,
							username: req.user.username,
							currentUser: req.user.username,
						});
					}
				});
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
router.get('/new', middleware.isLoggedIn, middleware.isUser, (req, res, next) => {
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

	dayPostFields.author = {
		id: req.user._id,
		username: req.user.username,
	};

	try {
		const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
		
		if (!foundProfile) {
			req.flash('error', 'You must create a profile to create posts!');
			res.redirect('back');
		}
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
	await Day.findById(req.params.id, (err, foundDay) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/api/days');
		} else {
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
		}
	});
});

//Get Editable Post
//Acess Private
router.get('/:id/edit', middleware.isLoggedIn, middleware.isUser, async (req, res, next) => {
	await Day.findById(req.params.id, (err, foundDay) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			res.render('edit', { day: foundDay, title: 'edit', user: req.user._id, currentUser: req.user.username });
		}
	});
});

//Edit Post
//Access Private
router.put('/:id', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	await Day.findByIdAndUpdate(req.params.id, req.body.day, (err, updatedDay) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('back');
		} else {
			req.flash('success', 'Successfully Edited Post!');
			res.redirect('/api/days');
		}
	});
});

//Delete User Post
//Private Access
router.delete('/:id/remove', middleware.isLoggedIn, middleware.isUser, (req, res) => {
	Day.findByIdAndRemove(req.params.id, err => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/:id');
		} else {
			req.flash('success', 'Successfully Deleted Post.');
			res.redirect('/api/days');
		}
	});
});

module.exports = router;
