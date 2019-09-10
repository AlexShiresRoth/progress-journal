const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const authhelper = require('../helpers/authhelper');
const isLoggedIn = require('../middleware/middleware');

router.use(methodOverride('_method'));

// GET home page.
router.get('/', authhelper.getLanding);

router.get('/signup', authhelper.getSignup);

// LOGIN ROUTE
router.post('/login', authhelper.authenticateLogin, authhelper.login);

//REGISTER ROUTE
router.post('/', authhelper.signUp);

//LOGOUT Route
router.get('/logout', isLoggedIn.isLoggedIn, authhelper.logout);



module.exports = router;
