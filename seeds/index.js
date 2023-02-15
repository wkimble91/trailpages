const mongoose = require('mongoose');
const cities = require('./cities');
const { body, rating, author } = require('./reviews');
const {
    places,
    descriptors,
    descriptions,
    imageURLs,
    difficulty,
} = require('./trails');
const Trail = require('../models/trails');
const Review = require('../models/review');

const dbUrl =
    'mongodb+srv://wkimble91:7emhuJBr6EpwHf936txnMWg7TyD7Yc@cluster0.pmajram.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Trail.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 500; i++) {
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
            difficulty: `${sample(difficulty)}`,
        });
        //Create reviews for seeded trail
        for (let i = 0; i < 7; i++) {
            let review = new Review({
                body: `${sample(body)}`,
                rating: `${sample(rating)}`,
                author: `${sample(author)}`,
            });
            trail.reviews.push(review);
            await review.save();
        }
        await trail.save();
    }
};

seedDB().then(() => {
    console.log('Database seeded');
    console.log('Database disconnected');
    mongoose.connection.close();
});
