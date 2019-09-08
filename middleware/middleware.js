const Day = require('../models/day');

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You are no longer logged in');
	res.redirect('/');
};

exports.isUser = (req,res, next) => {
	console.log(req.user)
	next();
}

exports.hasOwnerShip = (req, res, next) => {
	if (req.isAuthenticated()) {
		Day.findById(req.params.id, (err, foundDay) => {
			if (err) {
				res.redirect('/days');
			} else {
				if (foundDay.author.id.equals(req.user._id)) {
					console.log(typeof foundDay.text);
					res.render('show', { day: foundDay });
				} else {
					req.flash('error', 'Sorry, you do not have permission to view this post!');
					res.redirect('/days');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in first!');
		res.redirect('/');
	}
};

module.exports = exports;
