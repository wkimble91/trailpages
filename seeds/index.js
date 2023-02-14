const mongoose = require('mongoose');
const cities = require('./cities');
const { review, rating, author } = require('./reviews');
const { places, descriptors, descriptions, imageURLs } = require('./trails');
const Trail = require('../models/trails');

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Trail.deleteMany({});
    for (let i = 0; i < 600; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 1;
        const trail = new Trail({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} Trail`,
            images: [
                {
                    url: `${sample(imageURLs)}`,
                    filename: `${this.title}TrailSeededImage1`,
                },
                {
                    url: `${sample(imageURLs)}`,
                    filename: `${this.title}TrailSeededImage2`,
                },
                {
                    url: `${sample(imageURLs)}`,
                    filename: `${this.title}TrailSeededImage3`,
                },
                {
                    url: `${sample(imageURLs)}`,
                    filename: `${this.title}TrailSeededImage4`,
                },
                {
                    url: `${sample(imageURLs)}`,
                    filename: `${this.title}TrailSeededImage5`,
                },
            ],
            description: `${sample(descriptions)}`,
            price,
            creator: '62ffcb57e883b89aef5928a3',
            madeBy: `${sample(author)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            reviews: [
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
                {
                    body: `${sample(review)}`,
                    rating: `${sample(rating)}`,
                    author: `${sample(author)}`,
                },
            ],
        });
        await trail.save();
    }
};

seedDB().then(() => {
    console.log('Database seeded');
    console.log('Database disconnected');
    mongoose.connection.close();
});
