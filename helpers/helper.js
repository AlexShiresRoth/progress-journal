const Day = require('../models/day');

const axios = require('axios');

//Index page
//private access
exports.getIndex = async (req, res, next) => {
	let perPage = 4;
	let pageQuery = parseInt(req.query.page);
	let pageNumber = pageQuery ? pageQuery : 1;
	try {
		const foundDays = await axios.get('http://localhost:3000/api/days')
		console.log(foundDays)
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
};

//Create a new post form
//Private
exports.getNew = (req, res, next) => {
	res.render('new', { title: 'new Route', user: req.user._id, currentUser: req.user.username });
};

//Create the post
//private
exports.postNew = (req, res, next) => {
	Day.create(req.body.day, (err, newDay) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/days');
			console.log(err);
		} else {
			newDay.author.id = req.user._id;
			newDay.author.username = req.user.username;
			newDay.save();
			console.log(newDay);
			req.flash('success', 'New Post Added!');
			res.redirect('/days');
		}
	});
};

//Get a user's post
exports.getPost = (req, res) => {
	Day.findById(req.params.id, (err, foundDay) => {
		if (err) {
			res.redirect('/days');
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
				res.redirect('/days');
			}
		}
	});
};

exports.getEditedPost = (req, res, next) => {
	Day.findById(req.params.id, (err, foundDay) => {
		if (err) {
			req.flash('error', err.message);
			res.redirect('/days');
		} else {
			res.render('edit', { day: foundDay, title: 'edit', user: req.user._id, currentUser: req.user.username });
		}
	});
};

exports.editPost = (req, res) => {
	Day.findByIdAndUpdate(req.params.id, req.body.day, (err, updatedDay) => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/:id/edit');
		} else {
			req.flash('success', 'Successfully Edited Post!');
			res.redirect('/days');
		}
	});
};

exports.deletePost = (req, res) => {
	Day.findByIdAndRemove(req.params.id, err => {
		if (err) {
			console.log(err);
			req.flash('error', err.message);
			res.redirect('/:id');
		} else {
			req.flash('success', 'Successfully Deleted Post.');
			res.redirect('/days');
		}
	});
};

module.exports = exports;
