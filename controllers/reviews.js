//Models
const Review = require('../models/review');
const Trail = require('../models/trails');

module.exports.createReview = async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash('success', 'Review posted');
    res.redirect(`/trails/${trail._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/trails/${id}`);
};
