const express = require('express');
const router = express.Router();
const { genId } = require('../helpers/idGen');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/profiles');
const middleware = require('../middleware/middleware');

router.get('/', (req, res) => {
	res.redirect('/profile');
});

//GET profile todos
//Todos within user Profile
//Private Access
router.get('/:id/todos', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
	if (!foundProfile) {
		req.flash('error', 'You must create a profile first!');
		res.redirect('back');
	}
	const foundTodos = foundProfile.todos;
	res.render('tododash', {
		user: req.user._id,
		currentUser: req.user.username,
		todos: foundTodos,
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

	const { startDate, endDate, title, deleted } = req.body.todo;

	const todoFields = {};

	if (startDate) todoFields.startDate = startDate;
	if (endDate) todoFields.endDate = endDate;
	if (title) todoFields.title = title;
	if (deleted) todoFields.deleted = deleted;

	todoFields.completed = false;
	todoFields.id = genId();

	try {
		const foundProfile = await Profile.findOne({ 'userprofile.id': req.user._id });
		foundProfile.todos.unshift(todoFields);

		await foundProfile.save();

		req.flash('success', 'Todo was created');
		res.redirect(`/api/todos/${req.user._id}/todos`);
	} catch (error) {
		if (error) {
			console.log(error.message);
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//Get Create Todo Page
router.get('/:id/createtodo', (req, res) => {
	res.render('createtodo', {
		user: req.user._id,
		currentUser: req.user.username,
		username: req.user.username,
	});
});

//PUT Route
//Set as incomplete
router.put('/:id/incomplete', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	//find the index of the todo that is being selected for "incompletion".
	const foundTodo = foundProfile.todos
		.filter(todo => {
			return todo.id == req.params.id;
		})
		.map(newTodo => {
			return foundProfile.todos.indexOf(newTodo);
		});
	//set the todo's status as incomplete
	foundProfile.todos[foundTodo].completed = false;
	const incompletedTodos = foundProfile.todos;
	try {
		await foundProfile.update({ $set: { todos: incompletedTodos } });
		await foundProfile.save();

		req.flash('success', 'This task is now incomplete!');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//PUT Route
//Edit Todo to be incompleted
router.put('/:id/complete', middleware.isLoggedIn, middleware.isUser, async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	//find the index of the todo to be completed
	const foundTodo = foundProfile.todos
		.filter(todo => {
			return todo.id == req.params.id;
		})
		.map(newTodo => {
			return foundProfile.todos.indexOf(newTodo);
		});
	//set the status of the todo to be complete
	foundProfile.todos[foundTodo].completed = true;
	const completedTodos = foundProfile.todos;
	try {
		await foundProfile.update({ $set: { todos: completedTodos } });
		await foundProfile.save();

		req.flash('success', 'Good job completing that task!');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', error.message);
			res.redirect('back');
		}
	}
});

//Delete Todo
//Access Private
router.put('/:id/remove', async (req, res) => {
	const foundProfile = await Profile.findOne({ 'userprofile.username': req.user.username });
	try {
		const foundTodos = foundProfile.todos.filter(todo => {
			return todo.id !== req.params.id;
		});
		foundProfile.todos = foundTodos;
		await foundProfile.save();
		req.flash('success', 'Todo was removed.');
		res.redirect('back');
	} catch (error) {
		if (error) {
			req.flash('error', err.message);
			res.redirect('back');
		}
	}
});

module.exports = router;
