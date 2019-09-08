const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const helper = require('../helpers/helper');
const authhelper = require('../helpers/authhelper');
const isLoggedIn = require('../middleware/middleware');

router.use(methodOverride('_method'));

// GET home page.
router.get('/', authhelper.getLanding);

router.get('/signup', authhelper.getSignup);

router.get('/days/', isLoggedIn.isLoggedIn, helper.getIndex);

// LOGIN ROUTE
router.post('/login', authhelper.authenticateLogin, authhelper.login);

//REGISTER ROUTE
router.post('/', authhelper.signUp, helper.getIndex);

//LOGOUT Route

router.get('/logout', isLoggedIn.isLoggedIn, authhelper.logout);

/* days posts routes */

router.get('/days/new', isLoggedIn.isLoggedIn, helper.getNew);

router.post('/days', isLoggedIn.isLoggedIn, helper.postNew);

router.get('/days/:id', isLoggedIn.isLoggedIn, helper.getPost);

router.get('/:id/edit', isLoggedIn.isLoggedIn, helper.getEditedPost);

router.put('/days/:id', isLoggedIn.isLoggedIn, helper.editPost);

router.delete('/days/:id', isLoggedIn.isLoggedIn, helper.deletePost);


module.exports = router;
