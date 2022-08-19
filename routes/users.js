const express = require('express');
const router = express.Router();
//Auth
const passport = require('passport');
//Utils
const catchAsync = require('../utils/catchAsync');
//Controllers
const users = require('../controllers/users');
//Models
const User = require('../models/user');

router
    .route('/register')
    // Register User Page
    .get(users.renderRegister)
    // Creates User
    .post(catchAsync(users.register));

router
    .route('/login')
    // Login Page
    .get(users.renderLogin)
    // Logins User
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
            keepSessionInfo: true,
        }),
        users.login
    );

// Logouts User
router.get('/logout', users.logout);

module.exports = router;
