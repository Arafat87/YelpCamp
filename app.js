if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require('ejs-mate');
const joi = require('joi');
const methodoverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const campgroundroutes = require('./routes/campgrounds');
const reviewroutes = require('./routes/reviews');
const authroutes = require('./routes/users');

const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    //useCreateIndex:true,
    //useFindAndModify:false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error :"));
db.once("open", () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const sessionconfig = {
    store,
    name: "session",
    secret: 'Iron man is the best',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//THE LOCAL MONGOOSE CONTAINS THIS AS A PRE-DEFINDE FUNCTION ALREADY 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// FLASH MIDDLEWARE
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', authroutes);
app.use('/campgrounds', campgroundroutes);
app.use('/campgrounds/:id/reviews', reviewroutes);

app.get("/", (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError(req.message, 404));
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'SOMETHING WENT WRONG ! PAGE NOT FOUND';
    res.status(statusCode).render('error', {
        err
    });
});

app.listen(3000, () => {
    console.log("THE APP STARTS , WE SERVE PORT 3000");
});