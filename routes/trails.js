const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
//Models
const Trail = require('../models/trails');
//Controllers
const trails = require('../controllers/trails');
//Utils
const catchAsync = require('../utils/catchAsync');
//Middleware
const { isLoggedIn, isCreator, validateTrail } = require('../middleware.js');

router
    .route('/')
    .get(catchAsync(trails.index))
    .post(
        isLoggedIn,
        upload.array('image'),
        validateTrail,
        catchAsync(trails.createTrail)
    );

router.get('/new', isLoggedIn, trails.renderNewForm);

router
    .route('/:id')
    .get(catchAsync(trails.showTrail))
    .put(
        isLoggedIn,
        isCreator,
        upload.array('image'),
        validateTrail,
        catchAsync(trails.updateTrail)
    )
    .delete(isLoggedIn, isCreator, catchAsync(trails.deleteTrail));

router.get(
    '/:id/edit',
    isLoggedIn,
    isCreator,
    catchAsync(trails.renderEditForm)
);

module.exports = router;
