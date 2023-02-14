const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.cleanHTML': '{{#label}} must not include HTML',
    },
    rules: {
        cleanHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error('string.cleanHTML', { value });
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

module.exports.trailSchema = Joi.object({
    trail: Joi.object({
        title: Joi.string().required().cleanHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().cleanHTML(),
        description: Joi.string().required().cleanHTML(),
    }).required(),
    deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required().cleanHTML(),
    }),
});
