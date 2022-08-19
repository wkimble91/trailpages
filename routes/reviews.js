const express = require('express');
const router = express.Router({ mergeParams: true });
//Models
const Trail = require('../models/trails');
const Review = require('../models/review');
//Controllers
const reviews = require('../controllers/reviews');
//Utils
const catchAsync = require('../utils/catchAsync');
//Middleware
const { validateReview, isLoggedIn, isAuthor } = require('../middleware.js');

// Post a Review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete a Review
router.delete(
    '/:reviewId',
    isLoggedIn,
    isAuthor,
    catchAsync(reviews.deleteReview)
);

module.exports = router;
