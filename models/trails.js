const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };
const TrailSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        madeBy: String,
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
    },
    opts
);

TrailSchema.virtual('properties.popUpMarkup').get(function () {
    return `<img src="${
        this.images[0].thumbnail
    }"><br><strong><a href="/trails/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 74)}...</p>`;
});

// Delete all reviews for any deleted trail
TrailSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model('Trail', TrailSchema);
