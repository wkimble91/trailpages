const { cloudinary } = require('../cloudinary');
const Trail = require('../models/trails');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports.index = async (req, res) => {
    const trails = await Trail.find({});
    res.render('trails/index', { trails });
};

module.exports.renderNewForm = (req, res) => {
    res.render('trails/new');
};

module.exports.createTrail = async (req, res, next) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.trail.location,
            limit: 1,
        })
        .send();
    const trail = new Trail(req.body.trail);
    trail.geometry = geoData.body.features[0].geometry;
    trail.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    trail.creator = req.user._id;
    await trail.save();
    req.flash('success', 'Successfully posted the new trail');
    res.redirect(`/trails/${trail._id}`);
};

module.exports.showTrail = async (req, res) => {
    const trail = await Trail.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author',
            },
        })
        .populate('creator');
    if (!trail) {
        req.flash('error', "Trail doesn't exist");
        return res.redirect('/trails');
    }
    res.render('trails/show', { trail });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail) {
        req.flash('error', "Trail doesn't exist");
        return res.redirect('/trails');
    }

    res.render('trails/edit', { trail });
};

module.exports.updateTrail = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const trail = await Trail.findByIdAndUpdate(id, {
        ...req.body.trail,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    trail.images.push(...imgs);
    await trail.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await trail.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash('success', 'Successfully updated trail');
    res.redirect(`/trails/${trail._id}`);
};

module.exports.deleteTrail = async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash('success', 'Trail deleted');
    res.redirect('/trails');
};
