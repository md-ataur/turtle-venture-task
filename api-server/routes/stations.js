const express = require('express');
const cookieParser = require("cookie-parser");
const csrf = require('csurf');
const bodyParser = require('body-parser');
const router = express.Router();
const DB = require('../models/db');

// create express app
const app = express();

// setup route middleware
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

app.use(cookieParser());

// New form
router.get('/new', csrfProtection, (req, res) => {
    res.render('stations/new', { csrfToken: req.csrfToken(), station: new DB() });
});

// Edit form
router.get('/edit/:id', csrfProtection, async (req, res) => {
    const station = await DB.findById(req.params.id);
    res.render('stations/edit', { csrfToken: req.csrfToken(), station: station });
});

// Insert
router.post('/', parseForm, csrfProtection, async (req, res) => {
    let station = new DB({
        name: req.body.name,
        postcode: req.body.postcode,
    });
    try {
        station = await station.save();
        res.redirect(`/profile`)
    } catch (e) {
        res.render('stations/new', { error: e });
    }
});

// Update
router.put('/:id', parseForm, csrfProtection, async (req, res) => {
    let station = await DB.findById(req.params.id);
    station.name = req.body.name;
    station.postcode = req.body.postcode;
    try {
        station = await station.save();
        res.redirect(`/profile`)
    } catch (e) {
        res.render('stations/edit', { error: e });
    }
});

// Delete
router.delete('/:id', parseForm, csrfProtection, async (req, res) => {
    await DB.findByIdAndDelete(req.params.id);
    res.redirect('/profile');
});

module.exports = router;