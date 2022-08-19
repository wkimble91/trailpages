const ExpressError = require('./utils/ExpressError');
const { trailSchema, reviewSchema } = require('./schemas.js');
const Trail = require('./models/trails');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};
// For trails
module.exports.isCreator = async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail.creator.equals(req.user._id)) {
        req.flash('error', 'You must be the creator of the trail');
        return res.redirect(`/trails/${id}`);
    }
    next();
};
// For reviews
module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You must be the creator of the review');
        return res.redirect(`/trails/${id}`);
    }
    next();
};

module.exports.validateTrail = (req, res, next) => {
    const { error } = trailSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
