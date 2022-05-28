const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    postcode: {
        type: String,
    },

});

module.exports = mongoose.model('station', stationSchema);