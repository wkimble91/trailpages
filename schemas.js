const BaseJoi = require('joi');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
});

const Joi = BaseJoi.extend(extension);

module.exports.trailSchema = Joi.object({
    trail: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required(),
    }),
});
