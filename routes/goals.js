const express = require('express');
const router = express.Router();
const { format } = require('date-fns');
const { genId } = require('../helpers/idGen');
const { getImages } = require('../helpers/images');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/profiles');
const middleware = require('../middleware/middleware');

router.get('/', middleware.isLoggedIn, (req, res) => {
	res.redirect('/profile');
});

//GET profile goals
//goals within user Profile
//Private Access
router.get('/:id/goals', middleware.isLoggedIn, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	if (!foundProfile) {
		req.flash('error', 'You must create a profile first!');
		res.redirect('back');
	}
	const foundGoals = foundProfile.goals;
	console.log('found goals' + foundGoals);
	res.render('goalsdash', {
		user: req.user._id,
		currentUser: req.user.username,
		goals: foundGoals,
		username: req.user.username,
	});
});

//Get Create Goal Page
router.get('/:id/creategoals', (req, res) => {
	res.render('creategoals', {
		user: req.user._id,
		currentUser: req.user.username,
		username: req.user.username,
	});
});

router.put('/', [check('title').isEmpty()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		req.flash('error', errors.array());
		res.redirect('back');
	}

	const { startDate, endDate, title, completed, steps } = req.body.goals;

	const goalFields = {};

	if (startDate) goalFields.startDate = startDate;
	if (endDate) goalFields.endDate = format(new Date(endDate), 'EEEEEE MMMM do');
	if (title) goalFields.title = title;
	if (completed) goalFields.completed = completed;

	if (typeof steps === 'object') goalFields.steps = [...steps];
	if (typeof steps === 'string') goalFields.steps = [steps];
	goalFields.image = getImages();
	goalFields.id = genId();
	try {
		const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
		console.log('this is' + foundProfile);
		foundProfile.goals.unshift(goalFields);
		await foundProfile.save();

		req.flash('success', 'A New Goal was added');
		res.redirect(`/api/goals/${req.user._id}/goals`);
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//PUT Route
//Set as incomplete
router.put('/:id/incomplete', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	//find the index of the todo that is being selected for "incompletion".
	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id == req.params.id;
		})
		.map(newGoal => {
			return foundProfile.goals.indexOf(newGoal);
		});
	//set the todo's status as incomplete
	foundProfile.goals[foundGoal].completed = false;
	const incompletedGoals = foundProfile.goals;
	try {
		await foundProfile.update({ $set: { goals: incompletedGoals } });
		await foundProfile.save();

		req.flash('success', 'This goal is now incomplete!');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//PUT Route
//Edit Goal to be incomplete
router.put('/:id/complete', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	//find the index of the todo to be completed
	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id == req.params.id;
		})
		.map(newGoal => {
			return foundProfile.goals.indexOf(newGoal);
		});

	//set the status of the todo to be complete
	foundProfile.goals[foundGoal].completed = true;
	const completedGoals = foundProfile.goals;
	try {
		await foundProfile.updateOne({ $set: { goals: completedGoals } });
		await foundProfile.save();
		console.log(foundProfile.goals);
		req.flash('success', 'Good job completing that goal!');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//PUT ROUTE
//ADD Step to goal
//TODO return the saved state of a goal if a step was added or removed
router.put('/:id/addstep', async (req, res) => {
	const { steps } = req.body;
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	console.log(req.params.id);
	res.json(foundProfile.goals);
});
//Delete Goal
//Access Private
router.put('/:id/remove', async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	try {
		const foundGoals = foundProfile.goals.filter(goal => {
			return goal.id !== req.params.id;
		});
		foundProfile.goals = foundGoals;
		await foundProfile.save();
		req.flash('success', 'Goal was removed.');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', err.message);
			res.redirect('back');
		}
	}
});

module.exports = router;
