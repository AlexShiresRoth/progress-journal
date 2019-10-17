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
//GET ROUTE
//RENDER EDIT GOAL PAGE
router.get('/:id/editgoal', async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	const foundGoal = foundProfile.goals.filter(goal => {
		return goal.id == req.params.id;
	});
	try {
		console.log(foundGoal);
		res.render('editgoal', {
			user: req.user._id,
			goal: foundGoal,
			currentUser: req.user.username,
			username: req.user.username,
		});
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//PUT ROUTE
//EDIT Goal
router.put('/:id/goals', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	const { endDate, title, steps } = req.body.goals;
	const editedGoal = foundProfile.goals
		.filter(goal => {
			return goal.id === req.params.id;
		})
		.map(goal => {
			return foundProfile.goals.indexOf(goal);
		});
	foundProfile.goals[editedGoal].endDate = new Date(endDate);
	foundProfile.goals[editedGoal].title = title;
	const editStep = foundProfile.goals[editedGoal].steps;

	//Handle if there is more than one step added
	if (typeof steps === 'object') {
		foundProfile.goals[editedGoal].steps = [...steps];
		const newSteps = foundProfile.goals[editedGoal].steps.map((step, i) => {
			const stepFields = {};
			stepFields.title = step;
			stepFields.completed = false;
			stepFields.id = genId();
			const newStep = Object.create(stepFields);
			return newStep;
		});
		foundProfile.goals[editedGoal].steps = [...editStep, ...newSteps];
	}

	//Handle for if there is only one step added
	if (typeof steps === 'string') {
		const stepFields = {};
		stepFields.title = steps;
		stepFields.completed = false;
		stepFields.id = genId();
		const newStep = Object.create(stepFields);
		foundProfile.goals[editedGoal].steps = [...editStep, newStep];
	}

	const editedGoals = foundProfile.goals;
	try {
		await foundProfile.updateOne({ $set: { goals: editedGoals } });
		await foundProfile.save();
		req.flash('success', 'Goal has been updated');
		res.redirect(`/api/goals/${req.user._id}/goals`);
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//PUT ROUTE
//CREATE GOAL
router.put('/', [check('title').isEmpty()], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		req.flash('error', errors.array());
		res.redirect('back');
	}

	const { endDate, title, completed, steps } = req.body.goals;

	const goalFields = {};
	if (endDate) goalFields.endDate = new Date(endDate);
	if (title) goalFields.title = title;
	if (completed) goalFields.completed = completed;
	if (typeof steps === 'object') {
		goalFields.steps = [...steps];
		const newSteps = goalFields.steps.map((step, i) => {
			const stepFields = {};
			stepFields.title = step;
			stepFields.completed = false;
			stepFields.id = genId();
			const newStep = Object.create(stepFields);
			return newStep;
		});
		goalFields.steps = newSteps;
		console.log(goalFields.steps);
	}
	if (typeof steps === 'string') {
		const stepFields = {};
		stepFields.title = steps;
		stepFields.completed = false;
		stepFields.id = genId();
		const newStep = Object.create(stepFields);
		goalFields.steps = [newStep];
	}
	goalFields.image = getImages();
	goalFields.id = genId();
	try {
		console.log(goalFields.steps);
		const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });

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
	const incompleteGoals = foundProfile.goals;
	try {
		await foundProfile.update({ $set: { goals: incompleteGoals } });
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
	const { steps } = req.body.goals;
	const foundProfile = await Profile.findOne({
		'userprofile.id': req.user._id,
	});

	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id === req.params.idGoal;
		})
		.map(goal => {
			return foundProfile.goals.indexOf(goal);
		});
	if (typeof steps === 'object') {
		foundProfile.goals[foundGoal].steps = [...steps];
		const newSteps = goalFields.steps.map((step, i) => {
			const stepFields = {};
			stepFields.title = step;
			stepFields.completed = false;
			stepFields.id = genId();
			const newStep = Object.create(stepFields);
			return newStep;
		});
		foundProfile.goals[foundGoal].steps = newSteps;
	}
	if (typeof steps === 'string') {
		const stepFields = {};
		stepFields.title = steps;
		stepFields.completed = false;
		stepFields.id = genId();
		const newStep = Object.create(stepFields);
		foundProfile.goals[foundGoal].steps = [newStep];
	}
	const addedSteps = foundProfile.goals;
	try {
		await foundProfile.updateOne({ $set: { goals: addedSteps } });
		await foundProfile.save();
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('back');
	}
});

//PUT ROUTE
//PRIVATE ACCESS
//UPDATE STEP STATUS
router.put('/:idGoal/:idStep/completestep', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });

	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id === req.params.idGoal;
		})
		.map(goal => {
			return foundProfile.goals.indexOf(goal);
		});
	const foundStep = foundProfile.goals[foundGoal].steps
		.filter(step => {
			return step.id === req.params.idStep;
		})
		.map(step => {
			return foundProfile.goals[foundGoal].steps.indexOf(step);
		});

	foundProfile.goals[foundGoal].steps[foundStep].completed = true;
	const completedSteps = foundProfile.goals;

	try {
		await foundProfile.updateOne({ $set: { goals: completedSteps } });
		await foundProfile.save();
		res.redirect('back');
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('back');
	}
});
//PUT ROUTE
//PRIVATE ACCESS
//UPDATE STEP STATUS
router.put('/:idGoal/:idStep/incompletestep', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });

	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id === req.params.idGoal;
		})
		.map(goal => {
			return foundProfile.goals.indexOf(goal);
		});
	const foundStep = foundProfile.goals[foundGoal].steps
		.filter(step => {
			return step.id === req.params.idStep;
		})
		.map(step => {
			return foundProfile.goals[foundGoal].steps.indexOf(step);
		});

	foundProfile.goals[foundGoal].steps[foundStep].completed = false;
	const completedSteps = foundProfile.goals;

	try {
		await foundProfile.updateOne({ $set: { goals: completedSteps } });
		await foundProfile.save();

		res.redirect('back');
	} catch (error) {
		req.flash('error', error.message);
		res.redirect('back');
	}
});
//Delete Step
//Access Private
router.put('/:idGoal/:idStep/removestep', async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user.id });

	const foundGoal = foundProfile.goals
		.filter(goal => {
			return goal.id === req.params.idGoal;
		})
		.map(goal => {
			return foundProfile.goals.indexOf(goal);
		});
	const foundSteps = foundProfile.goals[foundGoal].steps.filter(step => {
		return step.id !== req.params.idStep;
	});

	foundProfile.goals[foundGoal].steps = foundSteps;
	const updatedSteps = foundProfile.goals;
	try {
		await foundProfile.updateOne({ $set: { goals: updatedSteps } });
		await foundProfile.save();
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', err.message);
			res.redirect('back');
		}
	}
});
//Delete Goal
//Access Private
router.put('/:id/remove', async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user.id });
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
