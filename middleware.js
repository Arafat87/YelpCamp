module.exports.isLoggedIn = ((req, res, next) => {//checks if a user is logged in
    if (!req.isAuthenticated()) {
        req.flash('err', 'You must be logged in to perform that action!')
        return res.redirect('/login')
    }
    next();
})

module.exports.storeReturnTo = ((req, res, next) => {//stores the last visited URL to res.locals to return back to previous page before logging in
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next();
})

module.exports.notLoggedIn = ((req, res, next) => { //middleware to check if user is NOT logged in
    if (req.isAuthenticated()) {
        req.flash('err', "You're already logged in. To switch account, logout first.")
        return res.redirect('/campgrounds')
    }
    next();
})

//campgrounds middlewares
const Campground = require('./models/campground')
const { campgroundSchema, reviewSchema, userSchema } = require('./schemas.js')

module.exports.isAuthor = (async (req, res, next) => {//middleware to check if the current user is the author of that campground
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('err', "Sorry, you don't have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

//campground validator
module.exports.validateCampground = (req, res, next) => {//middleware to validate campground
    const userInputs = req.body;
    const { error } = campgroundSchema.validate(userInputs)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('err', msg)
        req.flash('formData', userInputs) //storing the userInputs in the current session so that we can pre-fill the form after displaying the flash message
        // throw new expressError(msg, 400) //can be used to throw an error and display msg on new page instead of flash message
        return res.redirect(req.originalUrl.split('?_method=')[0])//redirecting to the same page
    } else {
        next();
    }
}

//reviews middlewares
const Review = require('./models/reviews')

//review validator
module.exports.validateReview = (req, res, next) => {//middleware to validate reviews
    const userInputs = req.body
    const { error } = reviewSchema.validate(userInputs)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('err', msg)
        req.flash('formData', userInputs)//storing the userInputs in the current session so that we can pre-fill the form after displaying the flash message
        res.redirect(req.originalUrl.split('/reviews')[0])
        //throw new expressError(msg, 400)//can be used to throw an error and display msg on new page instead of flash message
    } else {
        next()
    }
}

module.exports.isReviewAuthor = (async (req, res, next) => {//middleware to check if the current user is the author of the review
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('err', "Sorry, you didn't write this review!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
})

//user validator
module.exports.validateUser = (req, res, next) => {
    const userInputs = req.body
    const { error } = userSchema.validate(userInputs)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        req.flash('err', msg)
        res.redirect('/signup')
    } else {
        next();
    }
}