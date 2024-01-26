require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const {
    places,
    descriptors
} = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:  '65ad3a068c0e9e5d85df2639', 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dwxykvqno/image/upload/v1704197683/YelpCamp/nice_camp_jrq1ja.jpg',
                    filename: 'YelpCamp/nice_camp_jrq1ja'
                },
                {
                    url: 'https://res.cloudinary.com/dwxykvqno/image/upload/v1704197683/YelpCamp/fseprd848238_zwpyjc.jpg',
                    filename: 'YelpCamp/fseprd848238_zwpyjc'
                }
            ]
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})