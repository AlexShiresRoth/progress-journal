const express = require('express');
const router = express.Router();
const Day = require('../models/day');

//Search for posts by author or
router.get('/', (req, res) => {
	const { searchTerm } = req.query;
	if (searchTerm && searchTerm !== '' && searchTerm !== null && searchTerm.length > 0) {
		const regex = new RegExp(escapeRegex(searchTerm), 'gi');
		Day.find({}, (error, foundDays) => {
			const searchPosts = foundDays.filter(post => {
				return post.author.username.match(regex) || post.title.match(regex);
			});
			if (error) {
				console.log(error.message);
				req.flash('error', error.message);
				res.redirect('/');
			} else {
				res.render('search', {
					title: 'Progress Journal',
					foundDays: searchPosts,
					noPosts: searchPosts.length,
					user: req.user._id,
					username: req.user.username,
					currentUser: req.user.username,
				});
			}
		});
	}
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
module.exports = router;
