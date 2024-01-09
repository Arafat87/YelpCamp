const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {
                    value
                })
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({ //schema to vaildate campgrounds
    campground: Joi.object({
        title: Joi.string()
            .min(3)
            .max(30)
            .trim()
            .required().escapeHTML(),
        location: Joi.string().trim().required().escapeHTML(),
        img: Joi.array().max(5),
        price: Joi.number().min(0).required(),
        description: Joi.string().min(20).trim().required().escapeHTML(),
        reviews: Joi.array()

    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({ //schema to validate reviews
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().min(10).trim().required().escapeHTML()
    }).required()
})

module.exports.userSchema = Joi.object({
    email: Joi.string().email().trim().escapeHTML().required(),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .escapeHTML()
        .trim()
        .required(),
    password: Joi.string().escapeHTML().min(5).required()
})