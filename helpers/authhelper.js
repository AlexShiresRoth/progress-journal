const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

exports.getLanding = (req, res, next) => {
	res.render('landing');
};
exports.getSignup = async (req, res) => {
	await res.render('signup');
};

//Signup Page authentication
//Public
exports.signUp = ([check('email').isEmail(), check('password').isLength({ min: 6 })],
async (req, res, next) => {
	const { email, password, username, password2 } = req.body;

	const whiteSpace = /\s/g;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		req.flash('error', `${errors.array()}`);

		return res.status(400).json({ errors: errors.array() });
	}
	if (username.match(whiteSpace)) {
		req.flash('error', 'Username cannot contain spaces');
		res.redirect('/signup');
	}

	if (password !== password2) {
		req.flash('error', 'Passwords do not match!');
		res.redirect('/signup');
	}
	try {
		let newUser = new User({ username, email, password });

		const salt = await bcrypt.genSalt(10);

		newUser.password = await bcrypt.hash(password, salt);

		User.register(newUser, password, (err, user) => {
			if (err) {
				console.log(err);
				req.flash('error', err.message);
				return res.redirect('/signup');
			}
			passport.authenticate('local')(req, res, () => {
				req.flash('success', `Welcome to Progress Journal ${user.username}!`);
				next();
			});
		});
	} catch (error) {
		console.log(error.message);
		req.flash(error.message);
		res.redirect('/signup');
	}
});

exports.authenticateLogin = passport.authenticate('local', {
	successRedirect: '/days',
	failureRedirect: '/',
});
exports.login = (req, res, next) => {
	req.flash(`Welcome Back ${req.user.username}`);
};

exports.logout = (req, res, next) => {
	req.logout();
	req.flash('success', `Successfully Logged out.`);
	res.redirect('/');
};

module.exports = exports;
