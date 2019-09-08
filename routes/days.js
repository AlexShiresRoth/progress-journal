const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware');
const Day = require('../models/day');

router.get('/', middleware.isLoggedIn, (req, res) => {
	try {
		Day.find()
			.then(days => {
				res.json(days);
			})
			.catch(err => {
				res.send(err);
			});
	} catch (error) {
		console.log(error.message)
	}
});

router.post('/', middleware.isLoggedIn, (req, res) => {
	Day.create(req.body)
		.then(newDay => {
			newDay.author.id = req.user._id;
			newDay.author.username = req.user.username;
			res.status(201).json(newDay);
		})
		.catch(err => {
			res.send(err);
		});
});

router.get('/:dayId', (req, res) => {
	Day.findById(req.params.dayId)
		.then(foundDay => {
			res.json(foundDay);
		})
		.catch(err => {
			res.send(err);
		});
});

router.put('/:dayId', (req, res) => {
	Day.findByIdAndUpdate({ _id: req.params.dayId }, req.body, { new: true })
		.then(day => {
			res.json(day);
		})
		.catch(err => {
			res.send(err);
		});
});

router.delete('/:dayId', (req, res) => {
	Day.remove({ _id: req.params.dayId })
		.then(() => {
			res.json({ message: 'Day has been removed from database' });
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = router;
